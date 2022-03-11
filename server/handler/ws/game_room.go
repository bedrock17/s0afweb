package ws

import (
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	"github.com/gorilla/websocket"
)

type CreateGameRoomV1Response struct {
	game.Room
}

func CreateGameRoom(config game.CreateRoomConfig) game.Room {
	gameRoomManager := service.GetService().GameRoomManager()
	return gameRoomManager.NewRoom(config)
}

func JoinGameRoom(roomId uint, client *websocket.Conn) error {
	gameRoomManager := service.GetService().GameRoomManager()
	return gameRoomManager.JoinRoom(roomId, client)
}

func GetRoomConfig(roomId uint) (game.Room, bool) {
	gameRoomManager := service.GetService().GameRoomManager()
	return gameRoomManager.Get(roomId)
}
