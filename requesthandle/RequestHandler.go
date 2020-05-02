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
	"golang.org/x/crypto/acme/autocert"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

type dataBaseStruct struct {
	RankList []model.PopTileRank
}

var globalDataBaseStruct dataBaseStruct

func (d *dataBaseStruct) loadRankList(filePath string) {
	data, err := ioutil.ReadFile(filePath)

	if err == nil {

		err = json.Unmarshal(data, &d)

		common.Check(err)
	} else {
		fmt.Println("load rank list error!", err)
	}
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

func index(c echo.Context) error {
	// fmt.Fprintf(c.ResponseWriter, "Welcome!")
	// http.Redirect(c.ResponseWriter, c.Request, "/poptile", http.StatusFound)
	return c.String(http.StatusOK, "HELLO!")
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
func Run(httpServerConfig HTTPServerConfifg) {

	globalDataBaseStruct.loadRankList("jsondb/rank.json")

	log.Println(globalDataBaseStruct)

	// server := router.NewServer()

	e := echo.New()

	e.AutoTLSManager.HostPolicy = autocert.HostWhitelist("<DOMAIN>")
	// Cache certificates
	e.AutoTLSManager.Cache = autocert.DirCache("./cache")

	e.Use(middleware.Recover())
	e.Use(middleware.Logger())

	e.GET("/", index)

	e.Static("/static", "./static")

	e.POST("/api/poptilerank", popTileRankReg)
	e.GET("/api/poptilerank", popTileRankGet)
	// e.GET("/api/poptilerankload", popTileRankLod)

	e.File("/poptile", "./static/index.html")
	e.File("/poptile/classic", "./static/index.html")
	e.File("/poptile/custom", "./static/index.html")
	e.File("/poptile/rank", "./static/index.html")
	e.File("/static/poptile", "./static/idex.html")
	e.File("/static/poptile/classic", "./static/index.html")
	e.File("/static/pptile/custom", "./static/index.html")
	e.File("/static/popile/rank", "./static/index.html")

	addr := ":" + strconv.Itoa(int(httpServerConfig.HTTPSPort))

	fmt.Println(addr)
	// server.Run(addr)

	// e.Logger.Fatal(e.Start(addr))
	e.Logger.Fatal(e.StartAutoTLS(addr))
	// e.Logger.Fatal(e.Start(":8080")) //HTTP DEBUG

}
