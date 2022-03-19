package ws

import (
	"github.com/bedrock17/s0afweb/errors"
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	"github.com/bedrock17/s0afweb/websocket"
)

func StartGame(client *websocket.Client, roomId uint) ([]websocket.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	room, err := gameRoomManager.StartGame(client, roomId)
	if err != nil {
		return nil, err
	}
	index := 0
	clients := make([]*websocket.Client, len(room.Clients))
	for c := range room.Clients {
		clients[index] = c
		index += 1
	}
	resp := websocket.WSResponse{
		Clients: clients,
		Payload: websocket.WSPayload{
			Type: websocket.StartGameMessageType,
			Data: game.StartResponse{
				GameStartedAt: room.GameStartedAt,
				Seed:          room.Seed,
			},
		},
	}

	return []websocket.WSResponse{resp}, nil
}

func TouchTile(client *websocket.Client, touch websocket.TouchRequest) ([]websocket.WSResponse, error) {
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

	index, clients := 0, make([]*websocket.Client, len(room.Clients)-1)

	for c := range room.Clients {
		participant, err := userManager.GetUser(c)
		if err != nil {
			return nil, err
		}
		if participant.Id == user.Id {
			continue
		}
		clients[index] = c
		index += 1
	}

	resp := websocket.WSResponse{
		Clients: clients,
		Payload: websocket.WSPayload{
			Type: websocket.TouchMessageType,
			Data: websocket.TouchResponse{
				UserID: user.Id,
				X:      touch.X,
				Y:      touch.Y,
			},
		},
	}

	return []websocket.WSResponse{resp}, nil
}

func SimulateOneStep(client *websocket.Client, touch websocket.TouchRequest) error {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	user, err := userManager.GetUser(client)
	if err != nil {
		return err
	}
	room, err := gameRoomManager.Get(user.RoomId)
	if err != nil {
		return err
	}
	simulator, ok := room.Clients[client]
	if !ok {
		return errors.UserNotFoundErr
	}

	_, err = simulator.WalkOneStep(touch.X, touch.Y)
	return err
}

func GameOver(client *websocket.Client) (bool, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()

	user, err := userManager.GetUser(client)
	if err != nil {
		return false, err
	}

	room, err := gameRoomManager.Get(user.RoomId)
	if err != nil {
		return false, err
	}

	count := 0
	for _, sim := range room.Clients {
		if sim.GameOver {
			count += 1
		}
	}

	result := false
	if count >= len(room.Clients) {
		result = true
		room.GameTicker.ForceQuit()
	}

	return result, nil
}
