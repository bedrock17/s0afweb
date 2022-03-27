package ws

import (
	"github.com/bedrock17/s0afweb/errors"
	"github.com/bedrock17/s0afweb/proto"
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/websocket"
	"math/rand"
)

func StartGame(client *websocket.Client, roomId uint) ([]websocket.Response, error) {
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
	resp := websocket.Response{
		Clients: clients,
		Payload: &proto.Response{
			Type: proto.MessageType_start_game,
			Data: proto.ToAny(&proto.StartGameResponse{
				GameStartedAt: room.GameStartedAt,
				Seed:          room.Seed,
			}),
		},
		//Payload: websocket.WSPayload{
		//	Type: websocket.StartGameMessageType,
		//	Data: game.StartResponse{
		//		GameStartedAt: room.GameStartedAt,
		//		Seed:          room.Seed,
		//	},
		//},
	}

	return []websocket.Response{resp}, nil
}

func TouchTile(client *websocket.Client, touch *proto.TouchRequest) ([]websocket.Response, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	user, err := userManager.GetUser(client)

	if err != nil {
		return nil, err
	}

	room, err := gameRoomManager.Get(user.RoomId)

	if room.Status == proto.Room_idle {
		return nil, errors.ForbiddenErr
	}
	if err != nil {
		return nil, err
	}

	room.Mutex.Lock()
	defer room.Mutex.Unlock()

	count, _ := SimulateOneStep(client, touch)

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

	resp := make([]websocket.Response, 0)

	index, allClients := 0, make([]*websocket.Client, len(room.Clients))
	for c := range room.Clients {
		allClients[index] = c
		index += 1
	}

	touchMessage := websocket.Response{
		Clients: allClients,
		Payload: &proto.Response{
			Type: proto.MessageType_touch,
			Data: proto.ToAny(&proto.TouchResponse{
				UserId: user.Id,
				X:      touch.X,
				Y:      touch.Y,
			}),
		},
	}

	resp = append(resp, touchMessage)

	line := count / 10

	if line > 0 {

		alivePlayer := make([]*websocket.Client, 0)
		for c := range room.Clients {
			participant, err := userManager.GetUser(c)
			if err != nil {
				return nil, err
			}
			if participant.Id == user.Id {
				continue
			}
			sim, _ := room.Clients[c]
			if sim.GameOver {
				continue
			}
			alivePlayer = append(alivePlayer, c)
		}

		if len(alivePlayer) > 0 {
			targetIndex := rand.Intn(len(alivePlayer))
			simulator, _ := room.Clients[alivePlayer[targetIndex]]
			targetUser, _ := userManager.GetUser(alivePlayer[targetIndex])

			for i := 0; i < line; i++ {
				simulator.MakeBlocks()
			}

			index, allClients := 0, make([]*websocket.Client, len(room.Clients))
			for c := range room.Clients {
				allClients[index] = c
				index += 1
			}

			attackMessage := websocket.Response{
				Clients: allClients,
				Payload: &proto.Response{
					Type: proto.MessageType_attack,
					Data: proto.ToAny(&proto.AttackResponse{
						UserId: targetUser.Id,
						Lines:  int32(line),
					}),
				},
			}
			resp = append(resp, attackMessage)
		}
	}

	_, _ = GameOver(client)

	return resp, nil
}

func SimulateOneStep(client *websocket.Client, touch *proto.TouchRequest) (int, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	user, err := userManager.GetUser(client)
	if err != nil {
		return 0, err
	}
	room, err := gameRoomManager.Get(user.RoomId)
	if err != nil {
		return 0, err
	}
	simulator, ok := room.Clients[client]
	if !ok {
		return 0, errors.UserNotFoundErr
	}

	return simulator.WalkOneStep(int(touch.X), int(touch.Y))
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
