package ws

import (
	"github.com/bedrock17/s0afweb/proto"
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	websocket2 "github.com/bedrock17/s0afweb/websocket"
	"github.com/gorilla/websocket"
	pb "google.golang.org/protobuf/proto"
)

type CreateGameRoomV1Response struct {
	game.Room
}

type RoomUsersV1Response struct {
	UserIds []string `json:"user_ids"`
}

func ToProtoRoom(room game.Room) *proto.Room {
	return &proto.Room{
		Id:            uint32(room.Id),
		Headcount:     int32(room.Headcount),
		Capacity:      int32(room.Capacity),
		PlayTime:      room.PlayTime,
		MasterId:      room.Master,
		Status:        proto.Room_RoomStatus(room.Status),
		GameStartedAt: room.GameStartedAt,
	}
}

func onGameFinish(roomId uint) func() {
	userManager := service.GetService().UserManager()
	gameRoomManager := service.GetService().GameRoomManager()
	return func() {
		room, err := gameRoomManager.Get(roomId)
		if err != nil {
			return
		}

		index := 0
		clients := make([]*websocket2.Client, len(room.Clients))
		results := make([]*proto.UserScore, len(room.Clients))

		for c, sim := range room.Clients {
			user, err := userManager.GetUser(c)
			if err != nil {
				continue
			}
			clients[index] = c
			results[index] = &proto.UserScore{
				UserId: user.Id,
				Score:  int32(sim.Score),
			}
			index += 1
		}

		if err != nil {
			panic(err)
		}
		for _, c := range clients {
			respBytes, _ := pb.Marshal(&proto.Response{
				Type: proto.MessageType_finish_game,
				Data: proto.ToAny(&proto.FinishGameResponse{
					UserScores: results,
				}),
				Error: 0,
			})
			c.Mu.Lock()
			_ = c.Conn.WriteMessage(websocket.BinaryMessage, respBytes)
			c.Mu.Unlock()
		}

		err = gameRoomManager.ResetRoom(roomId)
		if err != nil {
			return
		}
	}
}

func GetRooms(client *websocket2.Client) ([]websocket2.Response, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	rooms := gameRoomManager.Gets()
	protoRooms := make([]*proto.Room, len(rooms))
	for i, room := range rooms {
		protoRooms[i] = ToProtoRoom(room)
	}

	resp := websocket2.Response{
		Clients: []*websocket2.Client{client},
		Payload: &proto.Response{
			Type: proto.MessageType_get_rooms,
			Data: proto.ToAny(&proto.GetRoomsResponse{Rooms: protoRooms}),
		},
	}
	return []websocket2.Response{resp}, nil
}

func CreateGameRoom(client *websocket2.Client, config *proto.CreateRoomRequest) ([]websocket2.Response, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	user, err := userManager.GetUser(client)
	if err != nil {
		return nil, err
	}

	room := gameRoomManager.NewRoom(config, user, onGameFinish)
	if err := gameRoomManager.JoinRoom(client, room.Id); err != nil {
		return nil, err
	}
	room, _ = gameRoomManager.Get(room.Id)
	// TODO: 입장에 실패했을때 방 제거
	resp := websocket2.Response{
		Clients: []*websocket2.Client{client},
		Payload: &proto.Response{
			Type: proto.MessageType_create_room,
			Data: proto.ToAny(&proto.CreateRoomResponse{Room: ToProtoRoom(room)}),
		},
	}
	return []websocket2.Response{resp}, nil
}

func JoinGameRoom(client *websocket2.Client, roomId uint) ([]websocket2.Response, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	user, err := userManager.GetUser(client)
	if err != nil {
		return nil, err
	}
	if err := gameRoomManager.JoinRoom(client, roomId); err != nil {
		return nil, err
	}
	room, _ := gameRoomManager.Get(roomId)

	index := 0
	clients := make([]*websocket2.Client, len(room.Clients))
	for c := range room.Clients {
		clients[index] = c
		index += 1
	}

	joinResp := websocket2.Response{
		Clients: clients,
		Payload: &proto.Response{
			Type: proto.MessageType_join_room,
			Data: proto.ToAny(&proto.JoinRoomResponse{UserId: user.Id}),
		},
	}
	roomConfigResp := websocket2.Response{
		Clients: []*websocket2.Client{client},
		Payload: &proto.Response{
			Type: proto.MessageType_room_config,
			Data: proto.ToAny(&proto.GetRoomConfigResponse{Room: ToProtoRoom(room)}),
		},
	}

	index = 0
	users := make([]string, len(room.Clients))
	for c := range room.Clients {
		user, err := userManager.GetUser(c)
		if err != nil {
			continue
		}
		users[index] = user.Id
		index += 1
	}
	roomUsers := websocket2.Response{
		Clients: []*websocket2.Client{client},
		Payload: &proto.Response{
			Type: proto.MessageType_room_users,
			Data: proto.ToAny(&proto.GetRoomUsersResponse{UserIds: users}),
		},
	}
	return []websocket2.Response{joinResp, roomConfigResp, roomUsers}, nil
}

func ExitGameRoom(client *websocket2.Client, roomId uint) ([]websocket2.Response, error) {
	gameRoomManager := service.GetService().GameRoomManager()
	userManager := service.GetService().UserManager()
	user, err := userManager.GetUser(client)
	if err != nil {
		return nil, err
	}
	room, err := gameRoomManager.Get(roomId)
	if err != nil {
		return nil, err
	}
	isRoomMaster := room.Master == user.Id

	if err := gameRoomManager.ExitRoom(client, roomId); err != nil {
		return nil, err
	}

	room, err = gameRoomManager.Get(roomId)
	index := 0
	clients := make([]*websocket2.Client, len(room.Clients))
	for c := range room.Clients {
		clients[index] = c
		index += 1
	}

	responses := make([]websocket2.Response, 1)
	responses = append(responses, websocket2.Response{
		Clients: clients,
		Payload: &proto.Response{
			Type: proto.MessageType_exit_room,
			Data: proto.ToAny(&proto.ExitRoomResponse{UserId: user.Id}),
		},
	})
	if err == nil && isRoomMaster {
		responses = append(responses, websocket2.Response{
			Clients: clients,
			Payload: &proto.Response{
				Type: proto.MessageType_room_config,
				Data: proto.ToAny(&proto.GetRoomConfigResponse{Room: ToProtoRoom(room)}),
			},
		})
	}
	return responses, nil
}

func GetRoomConfig(client *websocket2.Client, roomId uint) ([]websocket2.Response, error) {
	gameRoomManager := service.GetService().GameRoomManager()

	room, err := gameRoomManager.Get(roomId)
	if err != nil {
		return nil, err
	}

	resp := websocket2.Response{
		Clients: []*websocket2.Client{client},
		Payload: &proto.Response{
			Type: proto.MessageType_room_config,
			Data: proto.ToAny(&proto.GetRoomConfigResponse{Room: ToProtoRoom(room)}),
		},
	}
	return []websocket2.Response{resp}, nil
}
