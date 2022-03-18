package game

import (
	"github.com/bedrock17/s0afweb/errors"
	"github.com/bedrock17/s0afweb/game"
	"github.com/bedrock17/s0afweb/utils"
	"github.com/gorilla/websocket"
	"math/rand"
	"sync"
	"time"
)

type TouchRequest struct {
	X int `json:"x" validate:"required,numeric"`
	Y int `json:"y" validate:"required,numeric"`
}

type TouchResponse struct {
	UserID string `json:"user_id"`
	X      int    `json:"x"`
	Y      int    `json:"y"`
}

type CreateRoomConfig struct {
	Capacity int    `json:"capacity"  validate:"required,numeric,min=2,max=16"`
	PlayTime int32  `json:"play_time" validate:"required,numeric,min=10,max=300"`
	Master   string `json:"-"`
}

type RoomStatus int

type StartResponse struct {
	GameStartedAt int64 `json:"game_started_at"`
	Seed          int32 `json:"seed"`
}

type Room struct {
	Id            uint                                  `json:"id"`
	Clients       map[*websocket.Conn]*game.PopTileGame `json:"-"`
	Capacity      int                                   `json:"capacity"`
	PlayTime      int32                                 `json:"play_time"`
	Status        RoomStatus                            `json:"status"`
	Master        string                                `json:"master"`
	GameStartedAt int64                                 `json:"game_started_at"`
	Seed          int32                                 `json:"-"`
	GameTicker    utils.GameTicker                      `json:"-"`
}

const (
	RoomStatusIdle RoomStatus = iota
	RoomStatusInGame
)

type RoomManager interface {
	NewRoom(config CreateRoomConfig, onGameFinish func(uint) func()) Room
	JoinRoom(client *websocket.Conn, roomId uint) error
	ExitRoom(client *websocket.Conn, roomId uint) error
	ResetRoom(roomId uint) error
	Get(roomId uint) (Room, error)
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

func (m *RoomManagerImpl) NewRoom(config CreateRoomConfig, onGameFinish func(uint) func()) Room {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.counter++
	id := m.counter

	m.rooms[id] = Room{
		Id:       id,
		Clients:  map[*websocket.Conn]*game.PopTileGame{},
		Capacity: config.Capacity,
		PlayTime: config.PlayTime,
		Status:   RoomStatusIdle,
		Master:   config.Master,
		GameTicker: utils.GameTicker{
			Ticker:           time.NewTicker(1 * time.Second),
			OnFinishCallback: onGameFinish(id),
		},
	}

	return m.rooms[id]
}

func (m *RoomManagerImpl) Get(roomId uint) (Room, error) {
	room, ok := m.rooms[roomId]
	if !ok {
		return Room{}, errors.InvalidRoomIdErr
	}
	return room, nil
}

func (m *RoomManagerImpl) Gets() []Room {
	rooms := make([]Room, 0)
	for _, value := range m.rooms {
		rooms = append(rooms, value)
	}
	return rooms
}

func (m *RoomManagerImpl) ResetRoom(roomId uint) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	room, ok := m.rooms[roomId]
	if !ok {
		return errors.InvalidRoomIdErr
	}

	// TODO: 게임 끝난 후 초기화할 다른 방 설정 요소들 생각해볼 것
	room.GameStartedAt = 0
	room.Status = RoomStatusIdle
	m.rooms[roomId] = room

	return nil
}

func (m *RoomManagerImpl) JoinRoom(client *websocket.Conn, roomId uint) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	room, err := m.Get(roomId)
	if err != nil {
		return err
	}

	if room.Status == RoomStatusInGame {
		return errors.GameAlreadyStartedErr
	}

	if len(room.Clients) == room.Capacity {
		return errors.NoLeftSeatErr
	}

	user, err := m.userManager.GetUser(client)
	if err != nil {
		return err
	}
	if user.RoomId != 0 {
		return errors.CannotJoinMultipleRoomErr
	}
	m.userManager.SetUser(client, User{user.Id, roomId})
	room.Clients[client] = new(game.PopTileGame)
	m.rooms[roomId] = room

	return nil
}

func (m *RoomManagerImpl) ExitRoom(client *websocket.Conn, roomId uint) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	room, err := m.Get(roomId)
	if err != nil {
		return err
	}

	user, err := m.userManager.GetUser(client)
	if err != nil {
		return err
	}

	if len(room.Clients) > 1 {
		index := 0
		newClients := map[*websocket.Conn]*game.PopTileGame{}
		newUsers := make([]*User, len(room.Clients)-1)
		for conn, sim := range room.Clients {
			u, err := m.userManager.GetUser(conn)
			if err != nil {
				return err
			}
			if u.Id == user.Id {
				continue
			}
			newClients[conn] = sim
			newUsers[index] = u
		}

		// 방장인 경우 새로운 방장을 랜덤으로 선택
		if room.Master == user.Id {
			userLength := len(newUsers)
			if err != nil {
				return err
			}
			newMaster := newUsers[rand.Intn(userLength)]
			room.Master = newMaster.Id
		}
		room.Clients = newClients
		m.userManager.SetUser(client, User{user.Id, 0})
		m.rooms[roomId] = room
	} else {
		// 방의 마지막 유저인 경우 방 제거
		delete(m.rooms, roomId)
	}

	return nil
}

func (m *RoomManagerImpl) StartGame(client *websocket.Conn, roomId uint) (Room, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	room, err := m.Get(roomId)
	if err != nil {
		return Room{}, err
	}

	if room.Status == RoomStatusInGame {
		return Room{}, errors.GameAlreadyStartedErr
	}

	if len(room.Clients) <= 1 {
		return Room{}, errors.MinimumNumberPlayerErr
	}

	user, err := m.userManager.GetUser(client)
	if err != nil {
		return Room{}, err
	}

	if user.Id != room.Master {
		return Room{}, errors.UnauthorizedErr
	}

	now := time.Now()
	startedAt := now.UnixMilli()
	room.Status = RoomStatusInGame
	room.GameStartedAt = startedAt
	room.Seed = rand.Int31()%2147483646 + 1
	room.GameTicker.TickerDeadlineMilli = now.Add(time.Second * time.Duration(room.PlayTime)).UnixMilli()
	m.rooms[roomId] = room
	m.rooms[roomId].GameTicker.Start()
	for _, sim := range room.Clients {
		sim.Initialize(game.DefaultMapWidth, game.DefaultMapHeight, room.Seed)
	}
	return m.rooms[roomId], nil
}
