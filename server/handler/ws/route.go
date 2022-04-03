package ws

import (
	"github.com/bedrock17/s0afweb/errors"
	"github.com/bedrock17/s0afweb/proto"
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	websocket2 "github.com/bedrock17/s0afweb/websocket"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	pb "google.golang.org/protobuf/proto"
	"log"
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
			sendMessage(client, proto.MessageType_exit_room, responses, err)
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
		if rawUserId == nil {
			return errors.SessionDoseNotExist
		}

		userId := rawUserId.(string)
		if userId == "" {
			return errors.InvalidSessionErr
		}

		if _, err := userManager.GetUser(client); err != nil {
			userManager.SetUser(client, game.User{Id: userId, RoomId: 0})
		}

		request := new(proto.Request)
		if err := pb.Unmarshal(message, request); err != nil {
			panic(err)
		}

		var responses []websocket2.Response
		skipResponse := false

		switch request.Type {
		case proto.MessageType_get_rooms:
			responses, err = GetRooms(client)
		case proto.MessageType_create_room:
			payload := new(proto.CreateRoomRequest)
			err = pb.Unmarshal(request.Data.Value, payload)
			responses, err = CreateGameRoom(client, payload)
		case proto.MessageType_join_room:
			payload := new(proto.JoinRoomRequest)
			err = pb.Unmarshal(request.Data.Value, payload)
			responses, err = JoinGameRoom(client, uint(payload.RoomId))
		case proto.MessageType_room_config:
			payload := new(proto.GetRoomConfigRequest)
			err = pb.Unmarshal(request.Data.Value, payload)
			responses, err = GetRoomConfig(client, uint(payload.RoomId))
		case proto.MessageType_exit_room:
			payload := new(proto.ExitRoomRequest)
			err = pb.Unmarshal(request.Data.Value, payload)
			responses, err = ExitGameRoom(client, uint(payload.RoomId))
		case proto.MessageType_start_game:
			payload := new(proto.StartGameRequest)
			err = pb.Unmarshal(request.Data.Value, payload)
			responses, err = StartGame(client, uint(payload.RoomId))
		case proto.MessageType_touch:
			payload := new(proto.TouchRequest)
			err = pb.Unmarshal(request.Data.Value, payload)

			func() {
				gameRoomManager := service.GetService().GameRoomManager()
				user, terr := userManager.GetUser(client)
				if terr != nil {
					responses, err = nil, terr
				}
				room, terr := gameRoomManager.Get(user.RoomId)
				if terr != nil {
					responses, err = nil, terr
				}

				room.Mutex.Lock()
				defer room.Mutex.Unlock()

				responses, err = TouchTile(client, payload)
				sendMessage(client, request.Type, responses, err)
				skipResponse = true
			}()

		case proto.MessageType_heartbeat:
			client.Conn.SetReadDeadline(time.Now().Add(15 * time.Second))
			skipResponse = true
		}

		if !skipResponse {
			sendMessage(client, request.Type, responses, err)
		}

	}

	return nil
}

func sendMessage(client *websocket2.Client, reqType proto.MessageType, responses []websocket2.Response, err error) {
	if err != nil {
		payload := proto.Response{
			Type:  reqType,
			Data:  nil,
			Error: int32(err.(errors.WSError).Id),
		}
		respBytes, err := pb.Marshal(&payload)
		if err != nil {
			panic(err)
		}
		client.Mu.Lock()
		_ = client.Conn.WriteMessage(websocket.BinaryMessage, respBytes)
		client.Mu.Unlock()
	} else {
		for _, resp := range responses {
			respBytes, err := pb.Marshal(resp.Payload)
			if err != nil {
				log.Fatal(err)
			}
			for _, client := range resp.Clients {
				client.Mu.Lock()
				_ = client.Conn.WriteMessage(websocket.BinaryMessage, respBytes)
				client.Mu.Unlock()
			}
		}
	}
}
