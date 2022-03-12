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

func CreateGameRoom(config game.CreateRoomConfig, client *websocket.Conn) (game.Room, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	user, err := userManager.GetUser(client)
	if err != nil {
		return game.Room{}, err
	}
	if user.RoomId != 0 {
		return game.Room{}, errors.New("user is already in the room")
	}
	room := gameRoomManager.NewRoom(config)
	err = gameRoomManager.JoinRoom(room.Id, client)
	if err != nil {
		return game.Room{}, errors.New("failed to join the room")
	}
	err = userManager.JoinRoom(user, client)
	if err != nil {
		return game.Room{}, errors.New("failed to join the room")
	}
	// TODO: 입장에 실패했을때 방 제거
	return room, nil
}

func JoinGameRoom(roomId uint, client *websocket.Conn) error {
	gameRoomManager := service.GetService().GameRoomManager()
	return gameRoomManager.JoinRoom(roomId, client)
}

func GetRoomConfig(roomId uint) (game.Room, bool) {
	gameRoomManager := service.GetService().GameRoomManager()
	return gameRoomManager.Get(roomId)
}
