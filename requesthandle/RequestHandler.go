package requesthandle

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/bedrock17/router"
	"github.com/bedrock17/s0afWeb/data"
)

func index(c *router.Context) {
	// fmt.Fprintf(c.ResponseWriter, "Welcome!")
	http.Redirect(c.ResponseWriter, c.Request, "/static/index.html", http.StatusFound)
}

func staticHandle(c *router.Context) {
	http.NotFound(c.ResponseWriter, c.Request) //정적파일을 찾지 못한경우
}

func accessControlHeader(next router.HandlerFunc) router.HandlerFunc {
	return func(c *router.Context) {
		c.ResponseWriter.Header().Set("Access-Control-Allow-Origin", "*")
		next(c)
	}
}

//Run : 핸들러를 등록하고 http 서버를 시작한다.
func Run(port int) {

	data.MemoInit() //load config

	server := router.NewServer()
	server.AppendMiidleWare(router.LogHandler)
	server.AppendMiidleWare(router.RecoverHandler)
	server.AppendMiidleWare(router.StaticHandler)
	server.AppendMiidleWare(accessControlHeader)

	server.HandleFunc("GET", "/", index)
	server.HandleFunc("GET", "/memo", data.GetList)
	server.HandleFunc("OPTIONS", "/memo/:data", data.Options)
	server.HandleFunc("GET", "/memo/:data", data.Get)
	server.HandleFunc("POST", "/memo/:data", data.Post)
	server.HandleFunc("PUT", "/memo/:data", data.Update)
	server.HandleFunc("DELETE", "/memo/:data", data.Delete)

	server.HandleFunc("GET", "/static/*", staticHandle)

	addr := "localhost:" + strconv.Itoa(int(port))
	fmt.Println(addr)
	server.Run(addr)

}
