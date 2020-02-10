package data

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"time"

	"github.com/bedrock17/myMemoServer/common"
)

type memo struct {
	path       string
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	CratedTime time.Time `json:"createdtime"`
}

type memoList struct {
	Memos []string `json:"memos"`
}

//Create : 생성
func (m *memo) Create(dirName, fileName string, data []byte) {
	err := json.Unmarshal(data, m)
	common.Check(err)

	m.CratedTime = time.Now()

	b, err := json.Marshal(m)
	common.Check(err)

	err = os.Mkdir(dirName, 0644)

	if len(fileName) <= 64 {

		if len(fileName) > 0 {

			filePath := fmt.Sprintf("%s/%s.json", dirName, fileName)

			err = ioutil.WriteFile(filePath, b, 0644)
			common.Check(err)
			// fmt.Fprint(c.ResponseWriter, string(b))

		}
	}
}

// func
