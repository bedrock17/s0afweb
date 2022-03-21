package websocket

import (
	"github.com/bedrock17/s0afweb/proto"
	"github.com/gorilla/websocket"
	"sync"
)

type Client struct {
	Mu   sync.RWMutex
	Conn *websocket.Conn
}
type Response struct {
	Clients []*Client
	Payload *proto.Response
}
