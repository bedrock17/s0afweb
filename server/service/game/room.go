package game

import (
	"errors"
	"github.com/gorilla/websocket"
	"math/rand"
	"sync"
	"time"
)

type CreateRoomConfig struct {
	Capacity int    `json:"capacity"  validate:"required,numeric,min=2,max=16"`
	PlayTime int32  `json:"play_time" validate:"required,numeric,min=10,max=300"`
	Master   string `json:"-"`
}

type RoomStatus int

type Room struct {
	Id            uint              `json:"id"`
	Clients       []*websocket.Conn `json:"-"`
	Capacity      int               `json:"capacity"`
	PlayTime      int32             `json:"play_time"`
	Status        RoomStatus        `json:"status"`
	Master        string            `json:"master"`
	GameStartedAt int64             `json:"game_started_at"`
}

const (
	RoomStatusIdle RoomStatus = iota
	RoomStatusInGame
)

type RoomManager interface {
	NewRoom(config CreateRoomConfig) Room
	JoinRoom(roomId uint, client *websocket.Conn) error
	ExitRoom(roomId uint, client *websocket.Conn) error
	Get(roomId uint) (Room, bool)
	StartGame(roomId uint, client *websocket.Conn) (Room, error)
}

type RoomManagerImpl struct {
	mu          sync.Mutex
	rooms       map[uint]Room
	counter     uint
	userManager UserManager
}

func NewRoomManager(userManager UserManager) RoomManager {
	return &RoomManagerImpl{
		rooms:       make(map[uint]Room),
		counter:     0,
		userManager: userManager,
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

	room, ok := m.Get(roomId)
	if !ok {
		return errors.New("invalid room id")
	}

	if len(room.Clients) == room.Capacity {
		return errors.New("no player slot left")
	}

	user, err := m.userManager.GetUser(client)
	if err != nil {
		return err
	}
	if user.RoomId != 0 {
		return errors.New("user is already in the room")
	}
	m.userManager.SetUser(User{user.Id, roomId}, client)
	room.Clients = append(room.Clients, client)
	return nil
}

func (m *RoomManagerImpl) ExitRoom(roomId uint, client *websocket.Conn) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	room, ok := m.Get(roomId)
	if !ok {
		return errors.New("invalid room id")
	}

	userManager := m.userManager
	user, err := userManager.GetUser(client)
	if err != nil {
		return err
	}

	m.userManager.SetUser(User{user.Id, 0}, client)
	newClients := make([]*websocket.Conn, 0)
	newUsers := make([]User, 0)
	for _, client := range room.Clients {
		u, err := m.userManager.GetUser(client)
		if err != nil {
			return err
		}
		if u.Id == user.Id {
			continue
		}
		newClients = append(newClients, client)
		newUsers = append(newUsers, u)
	}
	if len(room.Clients) > 1 {
		// 방장인 경우 새로운 방장을 랜덤으로 선택
		if room.Master == user.Id {
			userLength := len(newUsers)
			if err != nil {
				return err
			}
			newMaster := newUsers[rand.Intn(userLength)]
			room.Master = newMaster.Id
			m.rooms[roomId] = room
		}
	} else {
		// 방의 마지막 유저인겨우 방 제거
		delete(m.rooms, roomId)
	}

	return nil
}

func (m *RoomManagerImpl) StartGame(roomId uint, client *websocket.Conn) (Room, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	room, ok := m.Get(roomId)
	if !ok {
		return Room{}, errors.New("invalid room id")
	}

	if room.Status == RoomStatusInGame {
		return Room{}, errors.New("game already started")
	}

	if len(room.Clients) <= 1 {
		return Room{}, errors.New("can't start the game alone")
	}

	user, err := m.userManager.GetUser(client)
	if err != nil {
		return Room{}, err
	}

	if user.Id != room.Master {
		return Room{}, errors.New("only master can start the game")
	}

	startedAt := time.Now().UnixMilli()
	room.Status = RoomStatusInGame
	room.GameStartedAt = startedAt
	m.rooms[roomId] = room
	return m.rooms[roomId], nil
}
