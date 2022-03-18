package websocket

import (
	"encoding/json"
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
	HeartbeatType            WSMessageType = "heartbeat"
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
	Clients []*Client
	Payload WSPayload
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
	case string(TouchMessageType):
		b.Data = new(TouchRequest)
	default:
	}

	type tmp WSRequest // avoids infinite recursion
	return json.Unmarshal(data, (*tmp)(b))
}

type TouchRequest struct {
	X int `json:"x" validate:"required,numeric"`
	Y int `json:"y" validate:"required,numeric"`
}

type TouchResponse struct {
	UserID string `json:"user_id"`
	X      int    `json:"x"`
	Y      int    `json:"y"`
}

type CreateRoomConfig struct {
	Capacity int    `json:"capacity"  validate:"required,numeric,min=2,max=16"`
	PlayTime int32  `json:"play_time" validate:"required,numeric,min=10,max=300"`
	Master   string `json:"-"`
}
