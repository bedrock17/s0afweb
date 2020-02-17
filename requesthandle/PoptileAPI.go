package requesthandle

import (
	"encoding/json"
	"fmt"
	"sort"

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

	find := false

	for i := 0; i < len(globalDataBaseStruct.RankList); i++ {
		if globalDataBaseStruct.RankList[i].UserName == data.UserName {
			if globalDataBaseStruct.RankList[i].Score < data.Score {
				globalDataBaseStruct.RankList[i].Score = data.Score
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
}

func popTileRankGet(c *router.Context) {
	b, err := json.Marshal(globalDataBaseStruct)
	common.Check(err)
	fmt.Fprintf(c.ResponseWriter, string(b))
}
