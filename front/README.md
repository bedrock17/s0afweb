# Poptile Frontend

## 로컬 개발 환경 설정

### Requirements 

- Node.js (가능하면 최신 LTS 버전을 사용해주세요)
- Yarn

### 개발 환경 실행 

1. `yarn` 명령어를 통해 의존성을 설치합니다.
2. `yarn dev` 명령어를 통해 개발 환경을 실행합니다.

### 린팅

현재 git hook이 설정되어 있지 않아 수동으로 실행해주어야 합니다. 커밋 전 아래의 두 명령어를 직접 실행해주세요.
- `yarn lint:js`: eslint 설정에 맞게 코드를 체크합니다.
- `yarn lint:css`: stylelint 설정에 맞게 코드를 체크합니다.

### Protocol Buffers 컴파일

프론트엔드 Protobuf 컴파일에는 [pbkit](https://github.com/pbkit/pbkit/blob/main/cli/pb/README.md#how-to-install) 을 사용합니다.

pbkit을 먼저 설치 한 후 아래 지침을 따라주세요

`pb vendor install` 명령어로 Protocol Buffers에 필요한 기본적인 파일들을 받아줍니다. 처음 한 번만 해주면 됩니다.

`yarn generate` 명령어를 통해 Protocol Buffers 파일을 컴파일합니다.
