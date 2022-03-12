package game

import (
	"encoding/json"
)

type WebSocketRequestType string

const (
	CreateRoomRequestType            WebSocketRequestType = "create_room"
	JoinRoomRequestType              WebSocketRequestType = "join_room"
	GetRoomConfigRequestType         WebSocketRequestType = "room_config"
	ExitRoomRequestType              WebSocketRequestType = "exit_room"
	GetRoomsRequestType              WebSocketRequestType = "get_rooms"
	StartGameRequestType             WebSocketRequestType = "start_game"
	FinishGameRequestType            WebSocketRequestType = "finish_game"
	BroadcastCurrentScoreRequestType WebSocketRequestType = "current_score"
	BroadcastFinalScoreRequestType   WebSocketRequestType = "final_score"
)

type WebSocketRequest struct {
	Type WebSocketRequestType `json:"type"`
	Data interface{}          `json:"data"`
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
	case string(CreateRoomRequestType):
		b.Data = new(CreateRoomConfig)
	case string(JoinRoomRequestType):
	case string(GetRoomConfigRequestType):
		b.Data = new(uint)
	}

	type tmp WebSocketRequest // avoids infinite recursion
	return json.Unmarshal(data, (*tmp)(b))
}
