package ws

import (
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
)

type CreateGameRoomV1Response struct {
	game.Room
}

func CreateGameRoom(request game.CreateRoomConfig) {
	gameRoomManager := service.GetService().GameRoomManager()
	room := gameRoomManager.NewRoom(request)
}
