package ws

import (
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	"github.com/gorilla/websocket"
)

func StartGame(roomId uint, client *websocket.Conn) (game.Room, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	return gameRoomManager.StartGame(roomId, client)
}
