package ws

import (
	"encoding/json"
	"errors"
	"github.com/bedrock17/s0afweb/service"
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
	userManager := service.GetService().UserManager()

	defer func() {
		userManager.RemoveUser(ws)
		ws.Close()
	}()

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

		if _, err := userManager.GetUser(ws); err != nil {
			userManager.SetUser(game.User{Id: userId, RoomId: 0}, ws)
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
			if room, err := CreateGameRoom(*config, ws); err == nil {
				data = room
			} else {
				data = err.Error()
			}
		case game.JoinRoomRequestType:
			roomId := request.Data.(uint)
			if err := JoinGameRoom(roomId, ws); err == nil {
				data = roomId
			} else {
				data = err.Error()
			}
		case game.GetRoomConfigRequestType:
			roomId := request.Data.(uint)
			room, ok := GetRoomConfig(roomId)
			if ok {
				data = room
			} else {
				data = nil
			}
		case game.ExitRoomRequestType:
			roomId := request.Data.(uint)
			if err := ExitGameRoom(roomId, ws); err == nil {
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
