package game

import (
	"errors"
	"github.com/gorilla/websocket"
	"sync"
)

type User struct {
	Id     string
	RoomId uint
}

type UserManager interface {
	SetUser(user User, client *websocket.Conn)
	RemoveUser(client *websocket.Conn)
	GetUser(client *websocket.Conn) (User, error)
	JoinRoom(user User, client *websocket.Conn) error
	ExitRoom(client *websocket.Conn) error
}

type UserManagerImpl struct {
	mu    sync.Mutex
	state map[*websocket.Conn]User
}

func NewUserManager() UserManager {
	return &UserManagerImpl{
		state: make(map[*websocket.Conn]User),
	}
}

func (m *UserManagerImpl) SetUser(user User, client *websocket.Conn) {
	m.state[client] = user
}

func (m *UserManagerImpl) RemoveUser(client *websocket.Conn) {
	delete(m.state, client)
}

func (m *UserManagerImpl) GetUser(client *websocket.Conn) (User, error) {
	user, ok := m.state[client]
	if !ok {
		return User{}, errors.New("user is nowhere")
	}

	return user, nil
}

func (m *UserManagerImpl) JoinRoom(user User, client *websocket.Conn) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, ok := m.state[client]; ok == true {
		return errors.New("already joined")
	}

	m.state[client] = User{
		Id:     user.Id,
		RoomId: user.RoomId,
	}

	return nil
}

func (m *UserManagerImpl) ExitRoom(client *websocket.Conn) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, ok := m.state[client]; ok == false {
		return errors.New("joined nowhere")
	}

	delete(m.state, client)

	return nil
}
