package data

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	// "net/http"
	// "strconv"

	"encoding/json"

	"github.com/bedrock17/router"
	"github.com/bedrock17/s0afWeb/common"
)

func loadMemo(filePath string) memo {
	var m memo
	data, err := ioutil.ReadFile(filePath)

	common.Check(err)

	err = json.Unmarshal(data, &m)

	common.Check(err)

	return m
}

//MemoInit : memo경로 설정
func MemoInit() {
	common.GlobalConfig.Load()
}

//GetList : 저장된 글 목록
func GetList(c *router.Context) {
	var memos memoList
	var memoArray []memo
	dirName := common.GlobalConfig.DataPath

	err := filepath.Walk(dirName, func(path string, info os.FileInfo, err error) error {
		if path != dirName {

			old := path[:len(dirName)+1]
			fileName := strings.Replace(path, old, "", 1)
			fileName = fileName[:len(fileName)-len(".json")]

			m := loadMemo(path)
			m.path = fileName
			memoArray = append(memoArray, m)
			// memos.Memos = append(memos.Memos, fileName)
		}
		return nil
	})
	common.Check(err)

	//시간순으로 정렬
	sort.Slice(memoArray[:], func(i, j int) bool {
		return memoArray[i].CratedTime.Sub(memoArray[j].CratedTime) < 0
	})

	//TODO: 얻어올 때부터 범위만큼만 얻어올 수 있도록 변경되어야 함
	var start, end string
	start = c.Request.URL.Query().Get("start")
	end = c.Request.URL.Query().Get("end")

	s, err1 := strconv.Atoi(start)
	e, err2 := strconv.Atoi(end)
	if err1 == nil && err2 == nil {
		if len(memoArray) > s-1 && len(memoArray) > e-1 {
			memoArray = memoArray[s-1 : e-1]
		}
	}

	for _, v := range memoArray {
		memos.Memos = append(memos.Memos, v.path)
	}

	data, err := json.Marshal(memos)

	common.Check(err)

	fmt.Fprintf(c.ResponseWriter, "%s", data)

}

//Get : 읽기
func Get(c *router.Context) {
	dirName := common.GlobalConfig.DataPath
	filePath := fmt.Sprintf("%s/%s.json", dirName, c.Params["data"])

	if common.FileExists(filePath) {
		data, err := ioutil.ReadFile(filePath)
		common.Check(err)

		fmt.Fprintf(c.ResponseWriter, "%s", data)
	} else {
		fmt.Fprintf(c.ResponseWriter, "%s %s", c.Params["data"], "is not exist")
	}

}

//Post : 생성
func Post(c *router.Context) {

	body := make([]byte, c.Request.ContentLength)
	c.Request.Body.Read(body)

	var data memo

	title := fmt.Sprintf("%s", c.Params["data"])
	dirName := common.GlobalConfig.DataPath
	data.Create(dirName, title, body)

}

//Update : 작성된 내용 업데이트
func Update(c *router.Context) {
	body := make([]byte, c.Request.ContentLength)
	c.Request.Body.Read(body)

	var data memo
	err := json.Unmarshal(body, &data)
	common.Check(err)

	dirName := common.GlobalConfig.DataPath
	filePath := fmt.Sprintf("%s/%s.json", dirName, c.Params["data"])

	if common.FileExists(filePath) {

		orgMemo := loadMemo(filePath)
		orgMemo.Content = data.Content //내용말고는 변경시키지 않는다.
		b, err := json.Marshal(orgMemo)
		common.Check(err)

		err = ioutil.WriteFile(filePath, b, 0644)
		common.Check(err)
		fmt.Fprint(c.ResponseWriter, string(b))
	} else {
		fmt.Fprintf(c.ResponseWriter, "%s %s", c.Params["data"], "is not exist")
	}
}

//Delete : 작성된 내용 삭제
func Delete(c *router.Context) {
	body := make([]byte, c.Request.ContentLength)
	c.Request.Body.Read(body)

	dirName := common.GlobalConfig.DataPath
	filePath := fmt.Sprintf("%s/%s.json", dirName, c.Params["data"])

	if common.FileExists(filePath) {
		os.Remove(filePath)
		fmt.Fprint(c.ResponseWriter, c.Params["data"], " is deleted")
	} else {
		fmt.Fprintf(c.ResponseWriter, "%s %s", c.Params["data"], "is not exist")
	}
}

//Options : uri에 어떤 method가 가능한지 응답
func Options(c *router.Context) {
	c.ResponseWriter.Header().Set("Access-Control-Allow-Headers", "*")
	c.ResponseWriter.Header().Set("Allow", "OPTIONS, DELETE, GET, POST, PUT")
	c.ResponseWriter.Header().Set("Access-Control-Allow-Methods", "OPTIONS, DELETE, GET, POST, PUT")
}
