package game

import (
	"errors"
	"github.com/gorilla/websocket"
	"math/rand"
	"sync"
	"time"
)

type TouchRequest struct {
	X uint `json:"x" validate:"required,numeric"`
	Y uint `json:"y" validate:"required,numeric"`
}

type TouchResponse struct {
	UserID string `json:"user_id"`
	X      uint   `json:"x"`
	Y      uint   `json:"y"`
}

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
	JoinRoom(client *websocket.Conn, roomId uint) error
	ExitRoom(client *websocket.Conn, roomId uint) error
	Get(roomId uint) (Room, bool)
	Gets() []Room
	StartGame(client *websocket.Conn, roomId uint) (Room, error)
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

func (m *RoomManagerImpl) Gets() []Room {
	var rooms []Room
	for _, value := range m.rooms {
		rooms = append(rooms, value)
	}
	return rooms
}

func (m *RoomManagerImpl) JoinRoom(client *websocket.Conn, roomId uint) error {
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
	m.userManager.SetUser(client, User{user.Id, roomId})
	room.Clients = append(room.Clients, client)
	return nil
}

func (m *RoomManagerImpl) ExitRoom(client *websocket.Conn, roomId uint) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	room, ok := m.Get(roomId)
	if !ok {
		return errors.New("invalid room id")
	}

	user, err := m.userManager.GetUser(client)
	if err != nil {
		return err
	}

	m.userManager.SetUser(client, User{user.Id, 0})
	index := 0
	newClients := make([]*websocket.Conn, len(room.Clients)-1)
	newUsers := make([]User, len(room.Clients)-1)
	for _, client := range room.Clients {
		u, err := m.userManager.GetUser(client)
		if err != nil {
			return err
		}
		if u.Id == user.Id {
			continue
		}
		newClients[index] = client
		newUsers[index] = u
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
		// 방의 마지막 유저인 경우 방 제거
		delete(m.rooms, roomId)
	}

	return nil
}

func (m *RoomManagerImpl) StartGame(client *websocket.Conn, roomId uint) (Room, error) {
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
