package ws

import (
	"encoding/json"
	"errors"
	"github.com/bedrock17/s0afweb/service/game"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"net/http"
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(*http.Request) bool { return true },
	}
)

func WebSocketHandlerV1(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()

	for {
		// Read
		_, message, err := ws.ReadMessage()
		if err != nil {
			c.Logger().Error(err)
			break
		}

		// validate session
		sess, err := session.Get("session", c)
		if err != nil {
			return err
		}

		rawUserId := sess.Values["userId"]
		if rawUserId == nil {
			return errors.New("invalid session")
		}

		userId := rawUserId.(string)
		if userId == "" {
			return errors.New("invalid userId on session")
		}

		request := new(game.WebSocketRequest)
		if err := json.Unmarshal(message, request); err != nil {
			panic(err)
		}

		var data interface{}

		switch request.Type {
		case game.CreateRoomRequestType:
			config := request.Data.(*game.CreateRoomConfig)
			config.Master = userId
			data = CreateGameRoom(*config)
		case game.JoinRoomRequestType:
			roomId := request.Data.(uint)
			err := JoinGameRoom(roomId, ws)
			if err == nil {
				data = roomId
			} else {
				data = err.Error()
			}
		}

		respBytes, _ := json.Marshal(game.WebSocketResponse{
			Type: request.Type,
			Data: data,
		})

		ws.WriteMessage(websocket.TextMessage, respBytes)
	}

	return nil
}
