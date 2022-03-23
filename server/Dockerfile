FROM golang:1.17-alpine

WORKDIR /app

ENV TZ Asia/Seoul
RUN apk add gcc musl-dev curl

RUN curl -LJO https://raw.githubusercontent.com/eficode/wait-for/master/wait-for \
     && chmod +x ./wait-for \
     && mv ./wait-for /usr/local/bin/wait-for

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./
RUN go build -o /poptile-server

EXPOSE 8080

CMD [ "wait-for", "db:3306", "--", "/poptile-server" ]
