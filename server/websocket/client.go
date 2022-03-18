package websocket

import (
	"github.com/gorilla/websocket"
	"sync"
)

type Client struct {
	Mu   sync.RWMutex
	Conn *websocket.Conn
}
