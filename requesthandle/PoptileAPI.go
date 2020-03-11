package requesthandle

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sort"

	"crypto/sha256"
	"sync"

	"github.com/bedrock17/router"
	"github.com/bedrock17/s0afweb/common"
	"github.com/bedrock17/s0afweb/model"
)

var rankMutex = &sync.Mutex{}

func popTileRankLoad(c *router.Context) {
	// fmt.Fprintf(c.ResponseWriter, "Welcome!")
	rankMutex.Lock()
	globalDataBaseStruct.loadRankList("jsondb/rank.json")
	rankMutex.Unlock()
	http.Redirect(c.ResponseWriter, c.Request, "/static/index.html", http.StatusFound)
}

func popTileRankReg(c *router.Context) {

	body := make([]byte, c.Request.ContentLength)
	c.Request.Body.Read(body)

	var data model.PopTileRank
	err := json.Unmarshal(body, &data)
	common.Check(err)

	if len(data.UserName) > 61 {
		fmt.Fprintf(c.ResponseWriter, "TOOOOOOOOO LONG.... (%d)", len(data.UserName))
		return
	}

	if data.Score < 15 || data.TouchCount < 15 {
		fmt.Fprintf(c.ResponseWriter, ":(")
		return
	}

	input := fmt.Sprintf("%s%d", data.UserName, (data.Score + data.TouchCount))
	hexSum := fmt.Sprintf("%x", sha256.Sum256([]byte(input)))

	log.Printf("%s\n", body)
	if data.Check != hexSum || data.Score > (120*120*data.TouchCount) {
		fmt.Fprintf(c.ResponseWriter, "ㅠㅠ")
		return
	}

	find := false

	rankMutex.Lock()
	if len(data.UserName) > 0 {
		for i := 0; i < len(globalDataBaseStruct.RankList); i++ {
			if globalDataBaseStruct.RankList[i].UserName == data.UserName {
				if globalDataBaseStruct.RankList[i].Score < data.Score {
					globalDataBaseStruct.RankList[i] = data
					globalDataBaseStruct.RankList[i].Check = ""
				}
				find = true
				break
			}
		}

		if !find {
			globalDataBaseStruct.RankList = append(globalDataBaseStruct.RankList, data)
		}

		sort.Slice(globalDataBaseStruct.RankList, func(i, j int) bool {
			return globalDataBaseStruct.RankList[i].Score > globalDataBaseStruct.RankList[j].Score
		})
	}

	b, err := json.MarshalIndent(globalDataBaseStruct, "", "\t")
	common.Check(err)
	err = ioutil.WriteFile("jsondb/rank.json", b, 0644)
	rankMutex.Unlock()

	fmt.Fprintf(c.ResponseWriter, string(b))

	common.Check((err))
}

func popTileRankGet(c *router.Context) {
	b, err := json.Marshal(globalDataBaseStruct)
	common.Check(err)
	fmt.Fprintf(c.ResponseWriter, string(b))
}
