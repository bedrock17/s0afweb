package game

import (
	"github.com/bedrock17/s0afweb/errors"
	"github.com/bedrock17/s0afweb/websocket"
	"sync"
)

type User struct {
	Id     string
	RoomId uint
}

type UserManager interface {
	SetUser(client *websocket.Client, user User)
	RemoveUser(client *websocket.Client)
	GetUser(client *websocket.Client) (*User, error)
}

type UserManagerImpl struct {
	mu    sync.Mutex
	state map[*websocket.Client]*User
}

func NewUserManager() UserManager {
	return &UserManagerImpl{
		state: make(map[*websocket.Client]*User),
	}
}

func (m *UserManagerImpl) SetUser(client *websocket.Client, user User) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.state[client] = &user
}

func (m *UserManagerImpl) RemoveUser(client *websocket.Client) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.state, client)
}

func (m *UserManagerImpl) GetUser(client *websocket.Client) (*User, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	user, ok := m.state[client]
	if !ok {
		return nil, errors.UserNotFoundErr
	}

	return user, nil
}
