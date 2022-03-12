package ws

import (
	"errors"
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	"github.com/gorilla/websocket"
)

func StartGame(client *websocket.Conn, roomId uint) ([]game.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	room, err := gameRoomManager.StartGame(client, roomId)
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

func TouchTile(client *websocket.Conn, touch game.TouchRequest) ([]game.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	user, err := userManager.GetUser(client)
	if err != nil {
		return nil, err
	}
	room, ok := gameRoomManager.Get(user.RoomId)
	if !ok {
		return nil, errors.New("invalid room id")
	}
	clients := make([]*websocket.Conn, 0)
	for _, client := range room.Clients {
		participant, err := userManager.GetUser(client)
		if err != nil {
			return nil, err
		}
		if participant.Id == user.Id {
			continue
		}
		clients = append(clients, client)
	}

	resp := game.WSResponse{
		Connections: clients,
		Payload: game.WSPayload{
			Type: game.TouchMessageType,
			Data: game.TouchResponse{
				UserID: user.Id,
				X:      touch.X,
				Y:      touch.Y,
			},
		},
	}

	return []game.WSResponse{resp}, nil
}
