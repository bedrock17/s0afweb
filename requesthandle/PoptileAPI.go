package requesthandle

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sort"
	"sync"

	"github.com/bedrock17/s0afweb/common"
	"github.com/bedrock17/s0afweb/game"
	"github.com/bedrock17/s0afweb/model"
	"github.com/labstack/echo"
)

var rankMutex = &sync.Mutex{}

func popTileRankReg(c echo.Context) error {

	data := new(model.PopTileRank)
	err := c.Bind(data)
	if err != nil {
		common.Check(err)
	}

	if len(data.UserName) > 61 {

		return c.String(http.StatusOK, fmt.Sprintf("TOOOOOOOOO LONG.... (%d)", len(data.UserName)))
	}

	if data.Score < 15 || data.TouchCount < 15 {
		// fmt.Fprintf(c.ResponseWriter, ":(")
		return c.String(http.StatusForbidden, "ERROR(403)")
	}

	input := fmt.Sprintf("%s%d", data.UserName, (data.Score + data.TouchCount))
	hexSum := fmt.Sprintf("%x", sha256.Sum256([]byte(input)))

	if data.Check != hexSum || data.Score > (120*120*data.TouchCount) {
		return c.String(http.StatusForbidden, "ERROR(403)")
	}

	if game.GameValidChceck(data) {
		fmt.Println("Check Pass!!")
	} else {
		fmt.Println("Check Error!!")
		return c.String(http.StatusForbidden, "ERROR(403)")
	}

	find := false

	rankMutex.Lock()
	if len(data.UserName) > 0 {
		for i := 0; i < len(globalDataBaseStruct.RankList); i++ {
			if globalDataBaseStruct.RankList[i].UserName == data.UserName {
				if globalDataBaseStruct.RankList[i].Score < data.Score {
					globalDataBaseStruct.RankList[i] = *data
					globalDataBaseStruct.RankList[i].Check = ""
				}
				find = true
				break
			}
		}

		if !find {
			globalDataBaseStruct.RankList = append(globalDataBaseStruct.RankList, *data)
		}

		sort.Slice(globalDataBaseStruct.RankList, func(i, j int) bool {
			return globalDataBaseStruct.RankList[i].Score > globalDataBaseStruct.RankList[j].Score
		})
	}

	b, err := json.MarshalIndent(globalDataBaseStruct, "", "\t")
	common.Check(err)
	err = ioutil.WriteFile("jsondb/rank.json", b, 0644)
	rankMutex.Unlock()

	// fmt.Fprintf(c.ResponseWriter, string(b))
	common.Check((err))
	return c.String(http.StatusOK, string(b))
}

func popTileRankGet(c echo.Context) error {
	b, err := json.Marshal(globalDataBaseStruct)
	common.Check(err)
	// fmt.Fprintf(c.ResponseWriter, string(b))
	return c.String(http.StatusOK, string(b))
}
