# Poptile (TalAlgo)

Poptile은 Go와 React를 기반으로 한 퍼즐 게임 프로젝트입니다. 싱글 플레이 및 온라인 멀티플레이 기능을 제공합니다.

## 프로젝트 구조

```
.
├── front/          # React + Vite 프론트엔드
├── server/         # Go 백엔드
├── proto/          # Protocol Buffers 정의 파일
└── docker-compose.yaml # Docker 오케스트레이션
```

## 기술 스택

### Frontend
- **Framework**: React (TypeScript)
- **Build Tool**: Vite
- **State Management**: Jotai
- **Styling**: Stitches
- **Communication**: Protocol Buffers (pbkit)

### Backend
- **Language**: Go
- **Web Framework**: Gin
- **ORM**: GORM
- **Database**: SQLite (default, `migrate.go` 참고)
- **Real-time**: WebSockets

## 가이드라인 및 개발 환경 설정

### 1. 사전 요구 사항

- Docker & Docker Compose
- Node.js (최신 LTS) & Yarn
- Go 1.17 이상
- Protocol Buffers 컴파일러 (pbkit, protoc)

### 2. 빠른 시작 (Docker Compose)

Docker를 사용하여 전체 서비스를 간단하게 실행할 수 있습니다.

1. `server/.env.example` 파일을 복사하여 `server/.env` 파일을 생성하고 필요한 값을 채웁니다.
2. 루트 디렉토리에서 아래 명령어를 실행합니다:
   ```bash
   docker-compose up --build
   ```
3. 프론트엔드는 `http://localhost`, 백엔드 API는 `http://localhost:8080`에서 확인할 수 있습니다.

### 3. 프론트엔드 개발 (`front/`)

1. 의존성 설치:
   ```bash
   cd front
   yarn
   ```
2. 개발 서버 실행:
   ```bash
   yarn dev
   ```
3. 린트 체크 (커밋 전 필수):
   ```bash
   yarn lint:js
   yarn lint:css
   ```

### 4. 백엔드 개발 (`server/`)

1. 환경 변수 설정: `server/.env` 파일이 필요합니다.
2. 서버 실행:
   ```bash
   cd server
   go run main.go
   ```

### 5. Protocol Buffers 관리

통신 데이터 구조가 변경되면 `.proto` 파일을 수정하고 각 플랫폼에 맞게 코드를 생성해야 합니다.

- **프론트엔드**: [pbkit](https://github.com/pbkit/pbkit) 설치 후
  ```bash
  cd front
  pb vendor install # 최초 1회
  yarn generate
  ```
- **백엔드**:
  ```bash
  cd server
  go generate ./...
  ```

## 개발 규칙 및 가이드라인

- **코드 스타일**: 
  - 프론트엔드는 ESLint와 Stylelint 규칙을 준수해야 합니다.
  - 백엔드는 표준 Go 컨벤션을 따릅니다.
- **Protocol Buffers**: API 통신 규격은 반드시 `proto/message.proto`를 통해 정의하며, 변경 시 양측 코드를 모두 재생성해야 합니다.
- **환경 변수**: 중요한 설정값이나 비밀키는 `.env` 파일에서 관리하며, 절대 git에 커밋하지 않습니다. 신규 환경 변수 추가 시 `.env.example`에도 반영해 주세요.
- **커밋**: 변경 사항에 대해 명확한 메시지를 작성하고, 가능하면 린트 체크를 마친 후 커밋해 주세요.
