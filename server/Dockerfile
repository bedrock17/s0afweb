FROM golang:1.17-alpine

WORKDIR /app

RUN apk add gcc musl-dev protobuf-dev

COPY server ./server
COPY proto ./proto
WORKDIR server
RUN go mod download
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go
RUN go generate ./...
RUN go build -o /poptile-server

EXPOSE 8080

CMD [ "/poptile-server" ]
