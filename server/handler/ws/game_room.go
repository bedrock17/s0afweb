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
	gameRoomManager := service.GetService().GameRoomManager()
	return func() {
		room, err := gameRoomManager.Get(roomId)
		if err != nil {
			return
		}
		for _, client := range room.Clients {
			// TODO: 점수 계산해서 브로드캐스트
			respBytes, _ := json.Marshal(WSPayload{
				Type: FinishGameMessageType,
				Data: nil,
			})
			client.WriteMessage(websocket.TextMessage, respBytes)
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
	room := gameRoomManager.NewRoom(config, onGameFinish)
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
	joinResp := WSResponse{
		Connections: room.Clients,
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
	index := 0
	users := make([]string, len(room.Clients))
	for _, client := range room.Clients {
		user, err := userManager.GetUser(client)
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
	if err := gameRoomManager.ExitRoom(client, roomId); err != nil {
		return nil, err
	}
	room, _ := gameRoomManager.Get(roomId)
	resp := WSResponse{
		Connections: room.Clients,
		Payload: WSPayload{
			Type: ExitRoomMessageType,
			Data: user.Id,
		},
	}
	return []WSResponse{resp}, nil
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
			Type: ExitRoomMessageType,
			Data: room,
		},
	}
	return []WSResponse{resp}, nil
}
