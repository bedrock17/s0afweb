# Poptile Server

## 로컬 개발 환경 설정

### Requirements

- Go 1.17

### 개발 환경 실행

**서버는 실행하기 위해 값이 채워진 `.env` 파일이 필요합니다.** 

1. 프로젝트 루트에서 `server` 디렉터리(이 파일이 있는 곳)로 이동합니다.
2. `go run main.go` 명령어로 로컬 서버를 실행합니다.

### Protocol Buffers

아래 명령어로 protoc를 설치합니다.
`go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.26`

그 다음 아래 명령어를 통해 Protocol Buffers 파일을 컴파일합니다.
`go generate ./...`

윈도우의 경우 따로 [protoc](https://github.com/protocolbuffers/protobuf/releases)
를 받은 후 `protoc.exe`와 `include` 폴더를 `%PATH%`로 옮겨야 작동합니다.