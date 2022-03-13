package ws

import (
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	"github.com/gorilla/websocket"
	"math/rand"
)

func StartGame(client *websocket.Conn, roomId uint) ([]WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	room, err := gameRoomManager.StartGame(client, roomId)
	if err != nil {
		return nil, err
	}

	startResponse := game.StartResponse{
		GameStartedAt: room.GameStartedAt,
		Seed:          rand.Int31()%2147483646 + 1,
	}

	resp := WSResponse{
		Connections: room.Clients,
		Payload: WSPayload{
			Type: StartGameMessageType,
			Data: startResponse,
		},
	}

	return []WSResponse{resp}, nil
}

func TouchTile(client *websocket.Conn, touch game.TouchRequest) ([]WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	user, err := userManager.GetUser(client)
	if err != nil {
		return nil, err
	}
	room, err := gameRoomManager.Get(user.RoomId)
	if err != nil {
		return nil, err
	}

	index, clients := 0, make([]*websocket.Conn, len(room.Clients)-1)

	for _, client := range room.Clients {
		participant, err := userManager.GetUser(client)
		if err != nil {
			return nil, err
		}
		if participant.Id == user.Id {
			continue
		}
		clients[index] = client
		index += 1
	}

	resp := WSResponse{
		Connections: clients,
		Payload: WSPayload{
			Type: TouchMessageType,
			Data: game.TouchResponse{
				UserID: user.Id,
				X:      touch.X,
				Y:      touch.Y,
			},
		},
	}

	return []WSResponse{resp}, nil
}

func FinishGame(client *websocket.Conn, result game.Result) ([]WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()

	user, err := userManager.GetUser(client)
	if err != nil {
		return nil, err
	}

	room, err := gameRoomManager.Get(user.RoomId)
	if err != nil {
		return nil, err
	}

	index, clients := 0, make([]*websocket.Conn, len(room.Clients)-1)

	for _, client := range room.Clients {
		participant, err := userManager.GetUser(client)
		if err != nil {
			return nil, err
		}
		if participant.Id == user.Id {
			continue
		}
		clients[index] = client
		index += 1
	}

	return []WSResponse{}, nil
}
