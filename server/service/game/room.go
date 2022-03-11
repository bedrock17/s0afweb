package game

import (
	"errors"
	"github.com/gorilla/websocket"
	"sync"
)

type CreateRoomConfig struct {
	Capacity int    `json:"capacity"  validate:"required,numeric,min=2,max=16"`
	PlayTime int32  `json:"play_time" validate:"required,numeric,min=10,max=300"`
	Master   string `json:"-"`
}

type RoomStatus int

type Room struct {
	Id       uint              `json:"id"`
	Clients  []*websocket.Conn `json:"-"`
	Capacity int               `json:"capacity"`
	PlayTime int32             `json:"play_time"`
	Status   RoomStatus        `json:"status"`
	Master   string            `json:"master"`
}

const (
	RoomStatusIdle RoomStatus = iota
	RoomStatusInGame
)

type RoomManager interface {
	NewRoom(config CreateRoomConfig) Room
	JoinRoom(roomId uint, client *websocket.Conn) error
	Get(roomId uint) (Room, bool)
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
		PlayTime: config.PlayTime,
		Status:   RoomStatusIdle,
		Master:   config.Master,
	}

	return m.rooms[id]
}

func (m *RoomManagerImpl) Get(roomId uint) (Room, bool) {
	room, ok := m.rooms[roomId]
	return room, ok
}

func (m *RoomManagerImpl) JoinRoom(roomId uint, client *websocket.Conn) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	room, ok := m.rooms[roomId]
	if !ok {
		return errors.New("invalid room id")
	}

	if len(room.Clients) == room.Capacity {
		return errors.New("no player slot left")
	}

	room.Clients = append(room.Clients, client)
	return nil
}
