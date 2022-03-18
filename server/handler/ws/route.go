package ws

import (
	"encoding/json"
	"github.com/bedrock17/s0afweb/errors"
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	websocket2 "github.com/bedrock17/s0afweb/websocket"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"net/http"
	"time"
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
	client := &websocket2.Client{Conn: ws}
	if err != nil {
		return err
	}
	userManager := service.GetService().UserManager()
	ws.SetReadDeadline(time.Now().Add(15 * time.Second))

	defer func() {
		user, err := userManager.GetUser(client)
		if err == nil && user.RoomId > 0 {
			responses, err := ExitGameRoom(client, user.RoomId)
			sendMessage(client, websocket2.ExitRoomMessageType, responses, err)
		}
		_ = ws.Close()
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

		_, err = userManager.GetUser(client)
		if err != nil {
			userManager.SetUser(client, game.User{Id: userId, RoomId: 0})
		}

		request := new(websocket2.WSRequest)
		if err := json.Unmarshal(message, request); err != nil {
			panic(err)
		}

		var responses []websocket2.WSResponse
		skipResponse := false

		switch request.Type {
		case websocket2.GetRoomsMessageType:
			responses, err = GetRooms(client)
		case websocket2.CreateRoomMessageType:
			config := request.Data.(*websocket2.CreateRoomConfig)
			config.Master = userId
			responses, err = CreateGameRoom(client, *config)
		case websocket2.JoinRoomMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = JoinGameRoom(client, roomId)
		case websocket2.GetRoomConfigMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = GetRoomConfig(client, roomId)
		case websocket2.ExitRoomMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = ExitGameRoom(client, roomId)
		case websocket2.StartGameMessageType:
			roomId := uint(request.Data.(float64))
			responses, err = StartGame(client, roomId)
		case websocket2.TouchMessageType:
			touch := request.Data.(*websocket2.TouchRequest)
			err = SimulateOneStep(client, *touch)
			_, _ = GameOver(client)
			responses, err = TouchTile(client, *touch)
		case websocket2.HeartbeatType:
			client.Conn.SetReadDeadline(time.Now().Add(15 * time.Second))
			skipResponse = true
		}

		if !skipResponse {
			sendMessage(client, request.Type, responses, err)
		}
	}

	return nil
}

func sendMessage(client *websocket2.Client, reqType websocket2.WSMessageType, responses []websocket2.WSResponse, err error) {
	client.Mu.Lock()
	defer func() {
		client.Mu.Unlock()
	}()

	if err != nil {
		respBytes, _ := json.Marshal(websocket2.WSPayload{
			Type:  reqType,
			Data:  nil,
			Error: err.(errors.WSError).Id,
		})

		_ = client.Conn.WriteMessage(websocket.TextMessage, respBytes)
	} else {
		for _, resp := range responses {
			for _, client := range resp.Clients {
				respBytes, _ := json.Marshal(resp.Payload)
				_ = client.Conn.WriteMessage(websocket.TextMessage, respBytes)
			}
		}
	}
}
