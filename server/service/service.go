package service

import (
	"github.com/bedrock17/s0afweb/service/game"
)

var service Service

type Service interface {
	GameRoomManager() game.RoomManager
}

type serviceImpl struct {
	gameRoomManager game.RoomManager
}

func InitService() {
	service = &serviceImpl{
		gameRoomManager: game.NewRoomManager(),
	}
}

func GetService() Service {
	return service
}

func (s *serviceImpl) GameRoomManager() game.RoomManager {
	return s.gameRoomManager
}
