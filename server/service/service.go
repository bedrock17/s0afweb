package service

import (
	"github.com/bedrock17/s0afweb/service/game"
)

var service Service

type Service interface {
	GameRoomManager() game.RoomManager
	UserManager() game.UserManager
}

type serviceImpl struct {
	gameRoomManager game.RoomManager
	userManager     game.UserManager
}

func InitService() {
	userManager := game.NewUserManager()
	service = &serviceImpl{
		gameRoomManager: game.NewRoomManager(userManager),
		userManager:     userManager,
	}
}

func GetService() Service {
	return service
}

func (s *serviceImpl) GameRoomManager() game.RoomManager {
	return s.gameRoomManager
}

func (s *serviceImpl) UserManager() game.UserManager {
	return s.userManager
}
