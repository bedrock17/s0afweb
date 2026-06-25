#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"
FRONT_DIR="$ROOT_DIR/front"

BACKEND_PORT="${BACKEND_PORT:-8080}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
INSTALL_DEPS=auto
GENERATE_PROTO=0
PACKAGE_MANAGER="${PACKAGE_MANAGER:-}"

SERVER_PID=""
FRONT_PID=""

usage() {
  cat <<EOF
Docker-free local development starter.

Usage:
  ./dev-start.sh [options]

Options:
  --install          Run yarn install even when front/node_modules exists.
  --skip-install     Do not run yarn install.
  --generate-proto   Regenerate protobuf code before starting services.
  --backend-port N   Backend port. Default: 8080
  --frontend-port N  Vite dev server port. Default: 3000
  -h, --help         Show this help.

What this starts without Docker:
  1. Backend:  cd server && PORT=\$BACKEND_PORT go run main.go
  2. Frontend: cd front  && <yarn|npm> dev --host 0.0.0.0 --port \$FRONTEND_PORT

Required local tools:
  - Go 1.17+
  - Node.js
  - Yarn or npm
  - protoc, only when --generate-proto is used

Notes:
  - server/.env is created from server/.env.example when missing.
  - server/db.sqlite is created automatically by the backend if missing.
  - Frontend requests /api and /ws are proxied to the backend by Vite.
EOF
}

log() {
  printf '[dev-start] %s\n' "$*"
}

fail() {
  printf '[dev-start] ERROR: %s\n' "$*" >&2
  exit 1
}

cleanup() {
  local exit_code=$?
  trap - INT TERM EXIT

  if [[ -n "${FRONT_PID:-}" ]] && kill -0 "$FRONT_PID" 2>/dev/null; then
    log "Stopping frontend (PID $FRONT_PID)"
    kill "$FRONT_PID" 2>/dev/null || true
  fi

  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    log "Stopping backend (PID $SERVER_PID)"
    kill "$SERVER_PID" 2>/dev/null || true
  fi

  wait 2>/dev/null || true
  exit "$exit_code"
}

require_command() {
  local command_name="$1"
  local install_hint="$2"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    fail "$command_name is required. $install_hint"
  fi
}

detect_package_manager() {
  if [[ -n "$PACKAGE_MANAGER" ]]; then
    case "$PACKAGE_MANAGER" in
      yarn|npm) ;;
      *) fail "PACKAGE_MANAGER must be either yarn or npm" ;;
    esac
    if ! "$PACKAGE_MANAGER" --version >/dev/null 2>&1; then
      fail "$PACKAGE_MANAGER was selected but is not runnable."
    fi
  elif command -v yarn >/dev/null 2>&1 && yarn --version >/dev/null 2>&1; then
    PACKAGE_MANAGER=yarn
  elif command -v npm >/dev/null 2>&1 && npm --version >/dev/null 2>&1; then
    PACKAGE_MANAGER=npm
  else
    fail "Yarn or npm is required. Install Node.js with npm, or install Yarn."
  fi

  log "Using package manager: $PACKAGE_MANAGER"
}

run_frontend_install() {
  if [[ "$PACKAGE_MANAGER" == "yarn" ]]; then
    (cd "$FRONT_DIR" && yarn install --frozen-lockfile)
  else
    (cd "$FRONT_DIR" && npm install)
  fi
}

run_frontend_script() {
  local script_name="$1"
  shift

  if [[ "$PACKAGE_MANAGER" == "yarn" ]]; then
    (cd "$FRONT_DIR" && yarn "$script_name" "$@")
  else
    (cd "$FRONT_DIR" && npm run "$script_name" -- "$@")
  fi
}

run_pb() {
  if command -v pb >/dev/null 2>&1 && pb --help >/dev/null 2>&1; then
    pb "$@"
  elif command -v npx >/dev/null 2>&1; then
    npx --yes -p @pbkit/pb-cli@0.0.72 pb "$@"
  else
    fail "pb is required, and npx is not available. Install pbkit CLI or install Node.js with npm."
  fi
}

run_protoc() {
  if command -v protoc >/dev/null 2>&1 && protoc --version >/dev/null 2>&1; then
    protoc "$@"
  elif command -v npx >/dev/null 2>&1; then
    npx --yes -p grpc-tools grpc_tools_node_protoc "$@"
  else
    fail "protoc is required, and npx is not available. Install protoc or install Node.js with npm."
  fi
}

path_for_host_tool() {
  local raw_path="$1"

  if command -v cygpath >/dev/null 2>&1; then
    cygpath -m "$raw_path"
  else
    printf '%s\n' "$raw_path"
  fi
}

go_bin_dir() {
  local dir
  dir="$(go env GOBIN)"

  if [[ -z "$dir" ]]; then
    dir="$(go env GOPATH)/bin"
  fi

  path_for_host_tool "$dir"
}

ensure_protoc_gen_go() {
  local go_bin plugin_path

  go_bin="$(go_bin_dir)"
  plugin_path="$go_bin/protoc-gen-go$(go env GOEXE)"

  if [[ ! -x "$plugin_path" ]]; then
    log "Installing protoc-gen-go" >&2
    go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.26
  fi

  [[ -x "$plugin_path" ]] || fail "protoc-gen-go was not found after installation: $plugin_path"
  printf '%s\n' "$plugin_path"
}

ensure_pb_vendor() {
  if [[ -f "$HOME/.config/pb/vendor/google/protobuf/any.proto" ]]; then
    log "pb vendor files already installed"
  else
    run_pb vendor install
  fi
}

port_is_busy() {
  local port="$1"

  if command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:"$port" -sTCP:LISTEN -t >/dev/null 2>&1
    return $?
  fi

  if command -v ss >/dev/null 2>&1; then
    ss -ltn "( sport = :$port )" 2>/dev/null | grep -q ":$port"
    return $?
  fi

  if command -v netstat >/dev/null 2>&1; then
    netstat -an 2>/dev/null | grep -E "[.:]$port[[:space:]].*LISTEN" >/dev/null
    return $?
  fi

  if command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -NoProfile -Command \
      "if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" \
      >/dev/null 2>&1
    return $?
  fi

  return 1
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --install)
        INSTALL_DEPS=always
        shift
        ;;
      --skip-install)
        INSTALL_DEPS=never
        shift
        ;;
      --generate-proto)
        GENERATE_PROTO=1
        shift
        ;;
      --backend-port)
        [[ $# -ge 2 ]] || fail "--backend-port requires a value"
        BACKEND_PORT="$2"
        shift 2
        ;;
      --frontend-port)
        [[ $# -ge 2 ]] || fail "--frontend-port requires a value"
        FRONTEND_PORT="$2"
        shift 2
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        fail "Unknown option: $1"
        ;;
    esac
  done
}

prepare_env() {
  if [[ ! -f "$SERVER_DIR/.env" ]]; then
    [[ -f "$SERVER_DIR/.env.example" ]] || fail "server/.env.example is missing"
    cp "$SERVER_DIR/.env.example" "$SERVER_DIR/.env"
    log "Created server/.env from server/.env.example"
  fi

  if grep -q '^PORT=' "$SERVER_DIR/.env"; then
    sed -i.bak "s/^PORT=.*/PORT=$BACKEND_PORT/" "$SERVER_DIR/.env"
    rm -f "$SERVER_DIR/.env.bak"
  else
    printf '\nPORT=%s\n' "$BACKEND_PORT" >> "$SERVER_DIR/.env"
  fi

  if grep -q '^PUBLIC_URL=' "$SERVER_DIR/.env"; then
    sed -i.bak "s#^PUBLIC_URL=.*#PUBLIC_URL=http://localhost:$FRONTEND_PORT#" "$SERVER_DIR/.env"
    rm -f "$SERVER_DIR/.env.bak"
  else
    printf 'PUBLIC_URL=http://localhost:%s\n' "$FRONTEND_PORT" >> "$SERVER_DIR/.env"
  fi
}

install_frontend_deps() {
  case "$INSTALL_DEPS" in
    always)
      log "Installing frontend dependencies"
      run_frontend_install
      ;;
    auto)
      if [[ ! -d "$FRONT_DIR/node_modules" || ! -f "$FRONT_DIR/node_modules/react/package.json" || ! -f "$FRONT_DIR/node_modules/vite/package.json" ]]; then
        log "Frontend dependencies are missing or incomplete; installing"
        run_frontend_install
      else
        log "Frontend dependencies already installed"
      fi
      ;;
    never)
      log "Skipping frontend dependency install"
      ;;
  esac
}

generate_proto() {
  [[ "$GENERATE_PROTO" -eq 1 ]] || return 0

  log "Regenerating frontend protobuf code"
  (cd "$FRONT_DIR" && ensure_pb_vendor && run_pb gen ts --entry-path ../proto -o src/proto --ext-in-import '.js' --runtime-package @pbkit/runtime)

  log "Regenerating backend protobuf code"
  local protoc_gen_go
  protoc_gen_go="$(ensure_protoc_gen_go)"
  (cd "$SERVER_DIR/proto" && run_protoc -I../../proto --plugin="protoc-gen-go=$protoc_gen_go" --go_out=:. ../../proto/message.proto)
}

check_generated_proto() {
  local missing=0

  if [[ ! -f "$SERVER_DIR/proto/message.pb.go" ]]; then
    missing=1
  fi

  if [[ ! -f "$FRONT_DIR/src/proto/messages/proto/index.ts" && ! -f "$FRONT_DIR/src/proto/messages/proto.ts" ]]; then
    missing=1
  fi

  if [[ "$missing" -eq 1 ]]; then
    if [[ "$GENERATE_PROTO" -eq 1 ]]; then
      fail "Protobuf generation finished, but generated files are still missing."
    fi

    fail "Generated protobuf files are missing. Run: ./dev-start.sh --generate-proto"
  fi
}

start_backend() {
  log "Starting backend on http://localhost:$BACKEND_PORT"
  (cd "$SERVER_DIR" && CGO_ENABLED=0 PORT="$BACKEND_PORT" go run main.go) &
  SERVER_PID=$!
}

start_frontend() {
  log "Starting frontend on http://localhost:$FRONTEND_PORT"
  if [[ "$PACKAGE_MANAGER" == "yarn" ]]; then
    (cd "$FRONT_DIR" && BACKEND_PORT="$BACKEND_PORT" VITE_BACKEND_WS_URL="ws://localhost:$BACKEND_PORT/v1/ws" yarn dev --host 0.0.0.0 --port "$FRONTEND_PORT") &
  else
    (cd "$FRONT_DIR" && BACKEND_PORT="$BACKEND_PORT" VITE_BACKEND_WS_URL="ws://localhost:$BACKEND_PORT/v1/ws" npm run dev -- --host 0.0.0.0 --port "$FRONTEND_PORT") &
  fi
  FRONT_PID=$!
}

main() {
  parse_args "$@"
  trap cleanup INT TERM EXIT

  require_command go "Install Go 1.17 or newer."
  require_command node "Install Node.js."
  detect_package_manager

  [[ -d "$SERVER_DIR" ]] || fail "server directory is missing"
  [[ -d "$FRONT_DIR" ]] || fail "front directory is missing"

  if port_is_busy "$BACKEND_PORT"; then
    fail "Port $BACKEND_PORT is already in use. Stop that process or pass --backend-port N."
  fi

  if port_is_busy "$FRONTEND_PORT"; then
    fail "Port $FRONTEND_PORT is already in use. Stop that process or pass --frontend-port N."
  fi

  prepare_env
  install_frontend_deps
  generate_proto
  if [[ "$GENERATE_PROTO" -eq 1 ]]; then
    check_generated_proto
  fi

  start_backend
  sleep 2
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    fail "Backend process exited during startup. Check the backend error above."
  fi
  start_frontend

  cat <<EOF

[dev-start] Services are running without Docker.
[dev-start] Backend:  http://localhost:$BACKEND_PORT
[dev-start] Frontend: http://localhost:$FRONTEND_PORT
[dev-start] Press Ctrl+C to stop both services.

EOF

  wait "$SERVER_PID" "$FRONT_PID"
}

main "$@"
