package game

import "encoding/json"

type WebSocketRequestType string

const (
	CreateRoomRequestType WebSocketRequestType = "create_room"
)

type baseRequest struct {
	Type WebSocketRequestType `json:"type"`
}

type WebSocketRequest struct {
	baseRequest
	Data interface{} `json:"data"`
}

func (d *WebSocketRequest) UnmarshalJSON(data []byte) error {
	var t baseRequest
	if err := json.Unmarshal(data, &t); err != nil {
		return err
	}

	switch t.Type {
	case CreateRoomRequestType:
		d.Data = new(CreateRoomConfig)
	}
	return json.Unmarshal(data, d.Data)

}
