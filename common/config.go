package common

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

const userConfigPath string = "custom/conf.json"
const defaultConfigPath string = "conf/conf.json"

//Config : 유저가 변경 가능한 설정들
type Config struct {
	HostName    string `json:HostName`
	ServicePort int    `json:"ServicePort"`
	// DataPath    string `json:"DataPath"`
}

//GlobalConfig :  전역 설정값
var GlobalConfig Config

//Save : 유저 설정 파일 저장
func (conf *Config) Save() {

	b, err := json.MarshalIndent(*conf, "", "\t")

	Check(err)

	err = ioutil.WriteFile(userConfigPath, b, 0644)

	Check(err)
}

//Load : 설정파일 로딩
//custom 에 파일이 없으면 conf에 들어있는 기본설정값을 읽어서 저장 custom에 저장한다.
func (conf *Config) Load() {

	data, err := ioutil.ReadFile(userConfigPath)

	if err != nil {
		data, err = ioutil.ReadFile(defaultConfigPath)

		Check(err)

		os.Mkdir("custom", 0644)
	}

	Check(err)

	err = json.Unmarshal(data, conf)

	Check(err)

	// fmt.Println("config : ", conf)

	conf.Save()

}
