package game

import (
	"golang.org/x/net/websocket"
	"sync"
)

type CreateRoomConfig struct {
	Capacity int   `json:"capacity"  validate:"required,numeric,min=2,max=16"`
	GameTime int32 `json:"game_time" validate:"required,numeric,min=10,max=300"`
}

type RoomStatus int

type Room struct {
	Id       uint              `json:"id"`
	Clients  []*websocket.Conn `json:"-"`
	Capacity int               `json:"capacity"`
	GameTime int32             `json:"game_time"`
	Status   RoomStatus        `json:"status"`
}

const (
	RoomStatusIdle RoomStatus = iota
	RoomStatusInGame
)

type RoomManager interface {
	NewRoom(config CreateRoomConfig) Room
}

type RoomManagerImpl struct {
	mu      sync.Mutex
	rooms   map[uint]Room
	counter uint
}

func NewRoomManager() RoomManager {
	return &RoomManagerImpl{
		rooms:   make(map[uint]Room),
		counter: 0,
	}
}

func (m *RoomManagerImpl) NewRoom(config CreateRoomConfig) Room {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.counter++
	id := m.counter

	m.rooms[id] = Room{
		Id:       id,
		Clients:  []*websocket.Conn{},
		Capacity: config.Capacity,
		GameTime: config.GameTime,
		Status:   RoomStatusIdle,
	}

	return m.rooms[id]
}
