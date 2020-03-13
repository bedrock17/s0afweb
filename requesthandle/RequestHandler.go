package requesthandle

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"

	// "os"

	"github.com/bedrock17/router"
	"github.com/bedrock17/s0afweb/common"
	"github.com/bedrock17/s0afweb/model"
)

type dataBaseStruct struct {
	RankList []model.PopTileRank
}

var globalDataBaseStruct dataBaseStruct

func (d *dataBaseStruct) loadRankList(filePath string) {
	data, err := ioutil.ReadFile(filePath)

	common.Check(err)

	err = json.Unmarshal(data, &d)

	common.Check(err)

}

func (d *dataBaseStruct) saveRankList(filePath string) {
	b, err := json.Marshal(d)
	common.Check(err)

	// err = os.Mkdir(dirName, 0644)

	if len(filePath) > 0 {
		err = ioutil.WriteFile(filePath, b, 0644)
		common.Check(err)
		// fmt.Fprint(c.ResponseWriter, string(b))
	}

}

func index(c *router.Context) {
	// fmt.Fprintf(c.ResponseWriter, "Welcome!")
	http.Redirect(c.ResponseWriter, c.Request, "/poptile", http.StatusFound)
}

func customStaticHandle(next router.HandlerFunc) router.HandlerFunc {

	filters := []string{"/static/", "/files/"}

	return func(c *router.Context) {

		file := c.Request.URL.Path
		pass := false
		for _, v := range filters {
			if strings.HasPrefix(file, v) {

				pass = true
				break
			}
		}

		if !pass {
			next(c)
			return
		}

		router.StaticHandler(next)(c)
	}
}

// Run : 핸들러를 등록하고 http 서버를 시작한다.
func Run(port int) {

	globalDataBaseStruct.loadRankList("jsondb/rank.json")

	log.Println(globalDataBaseStruct)

	server := router.NewServer()
	server.AppendMiidleWare(router.LogHandler)
	server.AppendMiidleWare(router.RecoverHandler)
	server.AppendMiidleWare(customStaticHandle)

	server.HandleFunc("GET", "/", index)

	server.HandleFunc("POST", "/api/poptilerank", popTileRankReg)
	server.HandleFunc("GET", "/api/poptilerank", popTileRankGet)
	server.HandleFunc("GET", "/api/poptilerankload", popTileRankLoad)

	server.HandleFunc("GET", "/poptile", vueURIHandelGenerator("./static/index.html"))
	server.HandleFunc("GET", "/poptile/rank", vueURIHandelGenerator("./static/index.html"))
	server.HandleFunc("GET", "/static/poptile", vueURIHandelGenerator("./static/index.html"))
	server.HandleFunc("GET", "/static/poptile/rank", vueURIHandelGenerator("./static/index.html"))

	addr := ":" + strconv.Itoa(int(port))

	fmt.Println(addr)
	server.Run(addr)

}
