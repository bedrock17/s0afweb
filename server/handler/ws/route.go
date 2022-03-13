package ws

import (
	"encoding/json"
	"fmt"
	"github.com/bedrock17/s0afweb/errors"
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
			sendMessage(ws, ExitRoomMessageType, responses, err)
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
		userId := rawUserId.(string)
		if rawUserId == nil || userId == "" {
			return errors.InvalidSessionErr
		}

		if _, err := userManager.GetUser(ws); err != nil {
			userManager.SetUser(ws, game.User{Id: userId, RoomId: 0})
		}

		request := new(WSRequest)
		if err := json.Unmarshal(message, request); err != nil {
			panic(err)
		}

		var responses []WSResponse

		switch request.Type {
		case GetRoomsMessageType:
			responses, err = GetRooms(ws)
		case CreateRoomMessageType:
			config := request.Data.(*game.CreateRoomConfig)
			config.Master = userId
			responses, err = CreateGameRoom(ws, *config)
		case JoinRoomMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = JoinGameRoom(ws, roomId)
		case GetRoomConfigMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = GetRoomConfig(ws, roomId)
		case ExitRoomMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = ExitGameRoom(ws, roomId)
		case StartGameMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = StartGame(ws, roomId)
		case TouchMessageType:
			touch := request.Data.(*game.TouchRequest)
			responses, err = TouchTile(ws, *touch)
		case FinishGameMessageType:
			result := request.Data.(*game.Result)
			responses, err = FinishGame(ws, *result)
		}

		sendMessage(ws, request.Type, responses, err)
	}

	return nil
}

func sendMessage(ws *websocket.Conn, reqType WSMessageType, responses []WSResponse, err error) {
	if err != nil {
		respBytes, _ := json.Marshal(WSPayload{
			Type:  reqType,
			Data:  nil,
			Error: err.(errors.WSError).Id,
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
