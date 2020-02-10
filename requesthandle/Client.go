package requesthandle

// import (
// 	"github.com/gorilla/websocket"
// )

// //Client: 클라이언트 구조체
// type Client struct {
// 	conn *websocket.Conn // 웹소켓 커넥션
// 	send chan *Message   // 메시지 전송용 채널

// 	roomId string // 현재 접속한 채팅방 아이디
// 	user   *User  // 현재 접속한 사용자 정보
// }

// const messageBufferSize = 256

// func newClient(conn *websocket.Conn, roomId string, u *User) {
//     // 새로운 클라이언트 생성
//     c := &Client{
//         conn:   conn,
//         send:   make(chan *Message, messageBufferSize),
//         roomId: roomId,
//         user:   u,
//     }

//     // clients 목록에 새로 생성한 클라이언트 추가
//     clients = append(clients, c)

//     // 메시지 수신/전송 대기
//     go c.readLoop()
//     go c.writeLoop()
// }

// func (c *Client) Close() {
//     // clients 목록에서 종료된 클라이언트 제거
//     for i, client := range clients {
//         if client == c {
//             clients = append(clients[:i], clients[i+1:]...)
//             break
//         }
//     }

//     // send 채널 닫음
//     close(c.send)

//     // 웹소켓 커넥션 종료
//     c.conn.Close()
//     log.Printf("close connection. addr: %s", c.conn.RemoteAddr())
// }
