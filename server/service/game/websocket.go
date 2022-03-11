package game

import (
	"encoding/json"
)

type WebSocketRequestType string

type Dynamic interface {
}

const (
	CreateRoomRequestType            WebSocketRequestType = "create_room"
	JoinRoomRequestType              WebSocketRequestType = "join_room"
	GetRoomsRequestType              WebSocketRequestType = "get_rooms"
	StartGameRequestType             WebSocketRequestType = "start_game"
	ExitGameRequestType              WebSocketRequestType = "exit_game"
	BroadcastCurrentScoreRequestType WebSocketRequestType = "current_score"
	BroadcastFinalScoreRequestType   WebSocketRequestType = "final_score"
)

type WebSocketRequest struct {
	Type WebSocketRequestType `json:"type"`
	Data Dynamic              `json:"data"`
}

type WebSocketResponse struct {
	Type WebSocketRequestType `json:"type"`
	Data interface{}          `json:"data"`
}

func (b *WebSocketRequest) UnmarshalJSON(data []byte) error {
	var t struct {
		Type string `json:"type"`
	}

	if err := json.Unmarshal(data, &t); err != nil {
		return err
	}

	switch t.Type {
	case "create_room":
		b.Data = new(CreateRoomConfig)
	case "join_room":
		b.Data = new(uint)
	}

	type tmp WebSocketRequest // avoids infinite recursion
	return json.Unmarshal(data, (*tmp)(b))
}
