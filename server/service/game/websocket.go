package game

import (
	"encoding/json"
	"github.com/gorilla/websocket"
)

type WSMessageType string

const (
	CreateRoomMessageType    WSMessageType = "create_room"
	JoinRoomMessageType      WSMessageType = "join_room"
	GetRoomConfigMessageType WSMessageType = "room_config"
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
	Type WSMessageType `json:"type"`
	Data interface{}   `json:"data"`
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
		b.Data = new(CreateRoomConfig)
	case string(JoinRoomMessageType):
	case string(GetRoomConfigMessageType):
		b.Data = new(uint)
	}

	type tmp WSRequest // avoids infinite recursion
	return json.Unmarshal(data, (*tmp)(b))
}
