package ws

import (
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	"github.com/gorilla/websocket"
)

func StartGame(client *websocket.Conn, roomId uint) ([]game.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	room, err := gameRoomManager.StartGame(roomId, client)
	if err != nil {
		return nil, err
	}

	resp := game.WSResponse{
		Connections: room.Clients,
		Payload: game.WSPayload{
			Type: game.StartGameMessageType,
			Data: room.GameStartedAt,
		},
	}
	return []game.WSResponse{resp}, nil
}
