package ws

import (
	"encoding/json"
	"github.com/bedrock17/s0afweb/service/game"
	"github.com/gorilla/websocket"
)

type WSMessageType string

const (
	CreateRoomMessageType    WSMessageType = "create_room"
	JoinRoomMessageType      WSMessageType = "join_room"
	GetRoomConfigMessageType WSMessageType = "room_config"
	RoomUsersMessageType     WSMessageType = "room_users"
	ExitRoomMessageType      WSMessageType = "exit_room"
	GetRoomsMessageType      WSMessageType = "get_rooms"
	StartGameMessageType     WSMessageType = "start_game"
	FinishGameMessageType    WSMessageType = "finish_game"
	TouchMessageType         WSMessageType = "touch_tile"
)

type WSRequest struct {
	Type WSMessageType `json:"type"`
	Data interface{}   `json:"data"`
}

type WSPayload struct {
	Type  WSMessageType `json:"type"`
	Data  interface{}   `json:"data"`
	Error int           `json:"error"`
}

type WSResponse struct {
	Connections []*websocket.Conn
	Payload     WSPayload
}

func (b *WSRequest) UnmarshalJSON(data []byte) error {
	var t struct {
		Type string `json:"type"`
	}

	if err := json.Unmarshal(data, &t); err != nil {
		return err
	}

	switch t.Type {
	case string(CreateRoomMessageType):
		b.Data = new(game.CreateRoomConfig)
	case string(TouchMessageType):
		b.Data = new(game.TouchRequest)
	case string(FinishGameMessageType):
		b.Data = new(game.Result)
	default:
	}

	type tmp WSRequest // avoids infinite recursion
	return json.Unmarshal(data, (*tmp)(b))
}
