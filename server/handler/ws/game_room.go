package ws

import (
	"errors"
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	"github.com/gorilla/websocket"
)

type CreateGameRoomV1Response struct {
	game.Room
}

func GetRooms(client *websocket.Conn) ([]game.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	rooms := gameRoomManager.Gets()

	resp := game.WSResponse{
		Connections: []*websocket.Conn{client},
		Payload: game.WSPayload{
			Type: game.GetRoomsMessageType,
			Data: rooms,
		},
	}
	return []game.WSResponse{resp}, nil
}

func CreateGameRoom(client *websocket.Conn, config game.CreateRoomConfig) ([]game.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	room := gameRoomManager.NewRoom(config)
	if err := gameRoomManager.JoinRoom(client, room.Id); err != nil {
		return nil, err
	}
	// TODO: 입장에 실패했을때 방 제거
	resp := game.WSResponse{
		Connections: []*websocket.Conn{client},
		Payload: game.WSPayload{
			Type: game.CreateRoomMessageType,
			Data: room,
		},
	}
	return []game.WSResponse{resp}, nil
}

func JoinGameRoom(client *websocket.Conn, roomId uint) ([]game.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	if err := gameRoomManager.JoinRoom(client, roomId); err != nil {
		return nil, err
	}
	room, _ := gameRoomManager.Get(roomId)
	resp := game.WSResponse{
		Connections: room.Clients,
		Payload: game.WSPayload{
			Type: game.JoinRoomMessageType,
			Data: roomId,
		},
	}
	return []game.WSResponse{resp}, nil
}

func ExitGameRoom(client *websocket.Conn, roomId uint) ([]game.WSResponse, error) {
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
	resp := game.WSResponse{
		Connections: room.Clients,
		Payload: game.WSPayload{
			Type: game.ExitRoomMessageType,
			Data: user.Id,
		},
	}
	return []game.WSResponse{resp}, nil
}

func GetRoomConfig(client *websocket.Conn, roomId uint) ([]game.WSResponse, error) {
	gameRoomManager := service.GetService().GameRoomManager()

	room, ok := gameRoomManager.Get(roomId)
	if !ok {
		return nil, errors.New("invalid room id")
	}

	resp := game.WSResponse{
		Connections: []*websocket.Conn{client},
		Payload: game.WSPayload{
			Type: game.ExitRoomMessageType,
			Data: room,
		},
	}
	return []game.WSResponse{resp}, nil
}
