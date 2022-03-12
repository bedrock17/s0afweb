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
	SetUser(client *websocket.Conn, user User)
	RemoveUser(client *websocket.Conn)
	GetUser(client *websocket.Conn) (User, error)
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

func (m *UserManagerImpl) SetUser(client *websocket.Conn, user User) {
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
