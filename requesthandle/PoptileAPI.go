package requesthandle

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"sort"

	"sync"

	"github.com/bedrock17/router"
	"github.com/bedrock17/s0afWeb/common"
	"github.com/bedrock17/s0afWeb/model"
)

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

	find := false

	var mutex = &sync.Mutex{}


	mutex.Lock()
	for i := 0; i < len(globalDataBaseStruct.RankList); i++ {
		if globalDataBaseStruct.RankList[i].UserName == data.UserName {
			if globalDataBaseStruct.RankList[i].Score < data.Score {
				globalDataBaseStruct.RankList[i].Score = data.Score
				globalDataBaseStruct.RankList[i].TouchCount = data.TouchCount
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

	b, err := json.Marshal(globalDataBaseStruct)
	common.Check(err)
	fmt.Fprintf(c.ResponseWriter, string(b))

	err = ioutil.WriteFile("jsondb/rank.json", b, 0644)
	common.Check((err))
	mutex.Unlock()
}

func popTileRankGet(c *router.Context) {
	b, err := json.Marshal(globalDataBaseStruct)
	common.Check(err)
	fmt.Fprintf(c.ResponseWriter, string(b))
}
