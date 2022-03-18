package ws

import (
	"encoding/json"
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	websocket2 "github.com/bedrock17/s0afweb/websocket"
	"github.com/gorilla/websocket"
)

type CreateGameRoomV1Response struct {
	game.Room
}

type RoomUsersV1Response struct {
	UserIds []string `json:"user_ids"`
}

func onGameFinish(roomId uint) func() {
	userManager := service.GetService().UserManager()
	gameRoomManager := service.GetService().GameRoomManager()
	return func() {
		room, err := gameRoomManager.Get(roomId)
		if err != nil {
			return
		}

		index := 0
		clients := make([]*websocket2.Client, len(room.Clients))
		results := map[string]int{}

		for c, sim := range room.Clients {
			user, err := userManager.GetUser(c)
			if err != nil {
				continue
			}
			clients[index] = c
			results[user.Id] = sim.Score
			index += 1
		}

		for _, c := range clients {
			respBytes, _ := json.Marshal(websocket2.WSPayload{
				Type: websocket2.FinishGameMessageType,
				Data: results,
			})
			c.Mu.Lock()
			_ = c.Conn.WriteMessage(websocket.TextMessage, respBytes)
			c.Mu.Unlock()
		}

		err = gameRoomManager.ResetRoom(roomId)
		if err != nil {
			return
		}
	}
}

func GetRooms(client *websocket2.Client) ([]websocket2.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	rooms := gameRoomManager.Gets()

	resp := websocket2.WSResponse{
		Clients: []*websocket2.Client{client},
		Payload: websocket2.WSPayload{
			Type: websocket2.GetRoomsMessageType,
			Data: rooms,
		},
	}
	return []websocket2.WSResponse{resp}, nil
}

func CreateGameRoom(client *websocket2.Client, config websocket2.CreateRoomConfig) ([]websocket2.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	room := gameRoomManager.NewRoom(config, onGameFinish)
	if err := gameRoomManager.JoinRoom(client, room.Id); err != nil {
		return nil, err
	}
	room, _ = gameRoomManager.Get(room.Id)
	// TODO: 입장에 실패했을때 방 제거
	resp := websocket2.WSResponse{
		Clients: []*websocket2.Client{client},
		Payload: websocket2.WSPayload{
			Type: websocket2.CreateRoomMessageType,
			Data: room,
		},
	}
	return []websocket2.WSResponse{resp}, nil
}

func JoinGameRoom(client *websocket2.Client, roomId uint) ([]websocket2.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	user, err := userManager.GetUser(client)
	if err != nil {
		return nil, err
	}
	if err := gameRoomManager.JoinRoom(client, roomId); err != nil {
		return nil, err
	}
	room, _ := gameRoomManager.Get(roomId)

	index := 0
	clients := make([]*websocket2.Client, len(room.Clients))
	for c := range room.Clients {
		clients[index] = c
		index += 1
	}

	joinResp := websocket2.WSResponse{
		Clients: clients,
		Payload: websocket2.WSPayload{
			Type: websocket2.JoinRoomMessageType,
			Data: user.Id,
		},
	}
	roomConfigResp := websocket2.WSResponse{
		Clients: []*websocket2.Client{client},
		Payload: websocket2.WSPayload{
			Type: websocket2.GetRoomConfigMessageType,
			Data: room,
		},
	}

	index = 0
	users := make([]string, len(room.Clients))
	for c := range room.Clients {
		user, err := userManager.GetUser(c)
		if err != nil {
			continue
		}
		users[index] = user.Id
		index += 1
	}
	roomUsers := websocket2.WSResponse{
		Clients: []*websocket2.Client{client},
		Payload: websocket2.WSPayload{
			Type: websocket2.RoomUsersMessageType,
			Data: RoomUsersV1Response{users},
		},
	}
	return []websocket2.WSResponse{joinResp, roomConfigResp, roomUsers}, nil
}

func ExitGameRoom(client *websocket2.Client, roomId uint) ([]websocket2.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	user, err := userManager.GetUser(client)
	if err != nil {
		return nil, err
	}
	room, err := gameRoomManager.Get(roomId)
	if err != nil {
		return nil, err
	}
	isRoomMaster := room.Master == user.Id

	if err := gameRoomManager.ExitRoom(client, roomId); err != nil {
		return nil, err
	}

	room, err = gameRoomManager.Get(roomId)
	index := 0
	clients := make([]*websocket2.Client, len(room.Clients))
	for c := range room.Clients {
		clients[index] = c
		index += 1
	}

	responses := make([]websocket2.WSResponse, 1)
	responses = append(responses, websocket2.WSResponse{
		Clients: clients,
		Payload: websocket2.WSPayload{
			Type: websocket2.ExitRoomMessageType,
			Data: user.Id,
		},
	})
	if err == nil && isRoomMaster {
		responses = append(responses, websocket2.WSResponse{
			Clients: clients,
			Payload: websocket2.WSPayload{
				Type: websocket2.GetRoomConfigMessageType,
				Data: room,
			},
		})
	}
	return responses, nil
}

func GetRoomConfig(client *websocket2.Client, roomId uint) ([]websocket2.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()

	room, err := gameRoomManager.Get(roomId)
	if err != nil {
		return nil, err
	}

	resp := websocket2.WSResponse{
		Clients: []*websocket2.Client{client},
		Payload: websocket2.WSPayload{
			Type: websocket2.GetRoomConfigMessageType,
			Data: room,
		},
	}
	return []websocket2.WSResponse{resp}, nil
}
