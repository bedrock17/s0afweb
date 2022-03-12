package ws

import (
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	"github.com/gorilla/websocket"
)

type CreateGameRoomV1Response struct {
	game.Room
}

func CreateGameRoom(config game.CreateRoomConfig, client *websocket.Conn) (game.Room, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	room := gameRoomManager.NewRoom(config)
	if err := gameRoomManager.JoinRoom(room.Id, client); err != nil {
		return game.Room{}, err
	}
	// TODO: 입장에 실패했을때 방 제거
	return room, nil
}

func JoinGameRoom(roomId uint, client *websocket.Conn) error {
	gameRoomManager := service.GetService().GameRoomManager()
	if err := gameRoomManager.JoinRoom(roomId, client); err != nil {
		return err
	}

	return nil
}

func ExitGameRoom(roomId uint, client *websocket.Conn) error {
	gameRoomManager := service.GetService().GameRoomManager()
	if err := gameRoomManager.ExitRoom(roomId, client); err != nil {
		return err
	}

	return nil
}

func GetRoomConfig(roomId uint) (game.Room, bool) {
	gameRoomManager := service.GetService().GameRoomManager()
	return gameRoomManager.Get(roomId)
}
