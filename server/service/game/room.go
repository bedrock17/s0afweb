package game

import (
	"github.com/bedrock17/s0afweb/errors"
	"github.com/bedrock17/s0afweb/game"
	"github.com/bedrock17/s0afweb/proto"
	"github.com/bedrock17/s0afweb/utils"
	"github.com/bedrock17/s0afweb/websocket"
	"math/rand"
	"sync"
	"time"
)

type RoomStatus int

type StartResponse struct {
	GameStartedAt int64 `json:"game_started_at"`
	Seed          int32 `json:"seed"`
}

type Room struct {
	Id            uint                                    `json:"id"`
	Clients       map[*websocket.Client]*game.PopTileGame `json:"-"`
	Headcount     int                                     `json:"headcount"`
	Capacity      int                                     `json:"capacity"`
	PlayTime      int32                                   `json:"play_time"`
	Status        proto.Room_RoomStatus                   `json:"status"`
	Master        string                                  `json:"master_id"`
	GameStartedAt int64                                   `json:"game_started_at"`
	Seed          int32                                   `json:"-"`
	GameTicker    *utils.GameTicker                       `json:"-"`
	Mutex         sync.Mutex                              `json:"-"`
}

type RoomManager interface {
	NewRoom(config *proto.CreateRoomRequest, masterId *User, onGameFinish func(uint) func()) Room
	JoinRoom(client *websocket.Client, roomId uint) error
	ExitRoom(client *websocket.Client, roomId uint) error
	FindUser(client *websocket.Client, roomId uint) bool
	ResetRoom(roomId uint) error
	Get(roomId uint) (Room, error)
	Gets() []Room
	StartGame(client *websocket.Client, roomId uint) (Room, error)
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

func (m *RoomManagerImpl) NewRoom(config *proto.CreateRoomRequest, masterId *User, onGameFinish func(uint) func()) Room {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.counter++
	id := m.counter

	m.rooms[id] = Room{
		Id:        id,
		Clients:   map[*websocket.Client]*game.PopTileGame{},
		Headcount: 0,
		Capacity:  int(config.Capacity),
		PlayTime:  config.PlayTime,
		Status:    proto.Room_idle,
		Master:    masterId.Id,
		GameTicker: &utils.GameTicker{
			TickerDuration:   1 * time.Second,
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

func (m *RoomManagerImpl) FindUser(client *websocket.Client, roomId uint) bool {
	client.Mu.Lock()
	defer client.Mu.Unlock()

	room, err := m.Get(roomId)
	if err != nil {
		return false
	}
	for c := range room.Clients {
		if c == client {
			return true
		}
	}
	return false
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
	room.Status = proto.Room_idle
	m.rooms[roomId] = room

	return nil
}

func (m *RoomManagerImpl) JoinRoom(client *websocket.Client, roomId uint) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	room, err := m.Get(roomId)
	if err != nil {
		return err
	}

	if room.Status == proto.Room_inGame {
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
	room.Headcount = len(room.Clients)
	m.rooms[roomId] = room

	return nil
}

func (m *RoomManagerImpl) ExitRoom(client *websocket.Client, roomId uint) error {
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
		newClients := map[*websocket.Client]*game.PopTileGame{}
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
			index += 1
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
		room.Headcount = len(room.Clients)
		m.rooms[roomId] = room
	} else {
		// 방의 마지막 유저인 경우 방 제거
		delete(m.rooms, roomId)
	}
	m.userManager.SetUser(client, User{user.Id, 0})

	return nil
}

func (m *RoomManagerImpl) StartGame(client *websocket.Client, roomId uint) (Room, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	room, err := m.Get(roomId)
	if err != nil {
		return Room{}, err
	}

	if room.Status == proto.Room_inGame {
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
	room.Status = proto.Room_inGame
	room.GameStartedAt = startedAt
	room.Seed = rand.Int31()%2147483646 + 1
	room.GameTicker.TickerDeadlineMilli = now.Add(time.Second * time.Duration(room.PlayTime)).UnixMilli()
	for _, sim := range room.Clients {
		sim.Initialize(game.DefaultMapWidth, game.DefaultMapHeight, room.Seed)
	}
	m.rooms[roomId].GameTicker.Start()
	m.rooms[roomId] = room
	return m.rooms[roomId], nil
}
