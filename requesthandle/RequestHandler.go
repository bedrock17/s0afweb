package requesthandle

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	// "os"

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
		fmt.Println(data)
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

// Run : 핸들러를 등록하고 http 서버를 시작한다.
func Run(httpServerConfig HTTPServerConfifg) {

	globalDataBaseStruct.loadRankList("jsondb/rank.json")

	log.Println(globalDataBaseStruct)

	e := echo.New()

	e.AutoTLSManager.HostPolicy = autocert.HostWhitelist(httpServerConfig.HostName)
	// Cache certificates
	e.AutoTLSManager.Cache = autocert.DirCache("./cache")

	e.Use(middleware.Recover())
	e.Use(middleware.Logger())

	e.File("/", "./static/index.html")

	e.Static("/static", "./static")

	e.POST("/api/poptilerank", popTileRankReg)
	e.GET("/api/poptilerank", popTileRankGet)

	e.File("/poptile", "./static/index.html")
	e.File("/poptile/classic", "./static/index.html")
	e.File("/poptile/custom", "./static/index.html")
	e.File("/poptile/rank", "./static/index.html")

	e.File("/static/poptile*", "./static/index.html")

	addr := ":" + strconv.Itoa(int(httpServerConfig.HTTPSPort))

	fmt.Println(addr)
	// e.Logger.Fatal(e.Start(addr))
	e.Logger.Fatal(e.StartAutoTLS(addr))
	// e.Logger.Fatal(e.Start(":8080")) //HTTP DEBUG

}
