package ws

import (
	"encoding/json"
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
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
		clients := make([]*websocket.Conn, len(room.Clients))
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
			respBytes, _ := json.Marshal(WSPayload{
				Type: FinishGameMessageType,
				Data: results,
			})
			_ = c.WriteMessage(websocket.TextMessage, respBytes)
		}

		err = gameRoomManager.ResetRoom(roomId)
		if err != nil {
			return
		}
	}
}

func OnHeartBeatCallback(roomId uint) func() {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	return func() {
		room, err := gameRoomManager.Get(roomId)

		if err != nil {
			return
		}

		for client := range room.Clients {
			user, err := userManager.GetUser(client)

			if err != nil {
				return
			}

			if user.LastHearBeatValue == 0 {
				_ = client.Close()
			} else {
				user.LastHearBeatValue = 0
			}
		}
	}
}

func GetRooms(client *websocket.Conn) ([]WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	rooms := gameRoomManager.Gets()

	resp := WSResponse{
		Connections: []*websocket.Conn{client},
		Payload: WSPayload{
			Type: GetRoomsMessageType,
			Data: rooms,
		},
	}
	return []WSResponse{resp}, nil
}

func CreateGameRoom(client *websocket.Conn, config game.CreateRoomConfig) ([]WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	room := gameRoomManager.NewRoom(config, onGameFinish, OnHeartBeatCallback)
	if err := gameRoomManager.JoinRoom(client, room.Id); err != nil {
		return nil, err
	}
	room, _ = gameRoomManager.Get(room.Id)
	// TODO: 입장에 실패했을때 방 제거
	resp := WSResponse{
		Connections: []*websocket.Conn{client},
		Payload: WSPayload{
			Type: CreateRoomMessageType,
			Data: room,
		},
	}
	return []WSResponse{resp}, nil
}

func JoinGameRoom(client *websocket.Conn, roomId uint) ([]WSResponse, error) {
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
	clients := make([]*websocket.Conn, len(room.Clients))
	for c := range room.Clients {
		clients[index] = c
		index += 1
	}

	joinResp := WSResponse{
		Connections: clients,
		Payload: WSPayload{
			Type: JoinRoomMessageType,
			Data: user.Id,
		},
	}
	roomConfigResp := WSResponse{
		Connections: []*websocket.Conn{client},
		Payload: WSPayload{
			Type: GetRoomConfigMessageType,
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
	roomUsers := WSResponse{
		Connections: []*websocket.Conn{client},
		Payload: WSPayload{
			Type: RoomUsersMessageType,
			Data: RoomUsersV1Response{users},
		},
	}
	return []WSResponse{joinResp, roomConfigResp, roomUsers}, nil
}

func ExitGameRoom(client *websocket.Conn, roomId uint) ([]WSResponse, error) {
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
	clients := make([]*websocket.Conn, len(room.Clients))
	for c := range room.Clients {
		clients[index] = c
		index += 1
	}

	responses := make([]WSResponse, 1)
	responses = append(responses, WSResponse{
		Connections: clients,
		Payload: WSPayload{
			Type: ExitRoomMessageType,
			Data: user.Id,
		},
	})
	if err == nil && isRoomMaster {
		responses = append(responses, WSResponse{
			Connections: clients,
			Payload: WSPayload{
				Type: GetRoomConfigMessageType,
				Data: room,
			},
		})
	}
	return responses, nil
}

func GetRoomConfig(client *websocket.Conn, roomId uint) ([]WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()

	room, err := gameRoomManager.Get(roomId)
	if err != nil {
		return nil, err
	}

	resp := WSResponse{
		Connections: []*websocket.Conn{client},
		Payload: WSPayload{
			Type: GetRoomConfigMessageType,
			Data: room,
		},
	}
	return []WSResponse{resp}, nil
}
