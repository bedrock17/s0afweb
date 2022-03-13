package ws

import (
	"encoding/json"
	"errors"
	"fmt"
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
		user, err := userManager.GetUser(ws)
		fmt.Println(user)
		if err == nil && user.RoomId > 0 {
			responses, err := ExitGameRoom(ws, user.RoomId)
			sendMessage(ws, game.ExitRoomMessageType, responses, err)
		}
		ws.Close()
	}()

	for {
		// Read
		_, message, err := ws.ReadMessage()
		if err != nil {
			c.Logger().Error(err)
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				break
			}
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
			userManager.SetUser(ws, game.User{Id: userId, RoomId: 0})
		}

		request := new(game.WSRequest)
		if err := json.Unmarshal(message, request); err != nil {
			panic(err)
		}

		var responses []game.WSResponse

		switch request.Type {
		case game.GetRoomsMessageType:
			responses, err = GetRooms(ws)
		case game.CreateRoomMessageType:
			config := request.Data.(*game.CreateRoomConfig)
			config.Master = userId
			responses, err = CreateGameRoom(ws, *config)
		case game.JoinRoomMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = JoinGameRoom(ws, roomId)
		case game.GetRoomConfigMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = GetRoomConfig(ws, roomId)
		case game.ExitRoomMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = ExitGameRoom(ws, roomId)
		case game.StartGameMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = StartGame(ws, roomId)
		case game.TouchMessageType:
			touch := request.Data.(*game.TouchRequest)
			responses, err = TouchTile(ws, *touch)
		case game.FinishGameMessageType:
			result := request.Data.(*game.Result)
			responses, err = FinishGame(ws, *result)
		}

		sendMessage(ws, request.Type, responses, err)
	}

	return nil
}

func sendMessage(ws *websocket.Conn, reqType game.WSMessageType, responses []game.WSResponse, err error) {
	if err != nil {
		respBytes, _ := json.Marshal(game.WSPayload{
			Type: reqType,
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
