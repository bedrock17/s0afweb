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

		request := new(game.WSRequest)
		if err := json.Unmarshal(message, request); err != nil {
			panic(err)
		}

		var responses []game.WSResponse

		switch request.Type {
		case game.CreateRoomMessageType:
			config := request.Data.(*game.CreateRoomConfig)
			config.Master = userId
			responses, err = CreateGameRoom(ws, *config)
		case game.JoinRoomMessageType:
			roomId := request.Data.(uint)
			responses, err = JoinGameRoom(ws, roomId)
		case game.GetRoomConfigMessageType:
			roomId := request.Data.(uint)
			responses, err = GetRoomConfig(ws, roomId)
		case game.ExitRoomMessageType:
			roomId := request.Data.(uint)
			responses, err = ExitGameRoom(ws, roomId)
		case game.StartGameMessageType:
			roomId := request.Data.(uint)
			responses, err = StartGame(ws, roomId)
		}

		if err != nil {
			respBytes, _ := json.Marshal(game.WSPayload{
				Type: request.Type,
				Data: err.Error(),
			})

			ws.WriteMessage(websocket.TextMessage, respBytes)
		} else {
			for _, resp := range responses {
				for _, conn := range resp.Connections {
					respBytes, _ := json.Marshal(resp.Payload)
					conn.WriteMessage(websocket.TextMessage, respBytes)
				}
			}
		}
	}

	return nil
}
