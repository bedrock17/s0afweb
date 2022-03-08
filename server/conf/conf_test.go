package conf_test

import (
	"os"
	"testing"
)
import "github.com/bedrock17/s0afweb/conf"

func TestServerConfig_LoadConfig(t *testing.T) {
	// 환경변수가 설정되지 않은 상태 확인

	c := conf.ServerConfig{}

	c.LoadConfig()

	if c.BindIP != "127.0.0.1" {
		t.Error("Default BindIP is wrong")
	}

	if c.BindPort != 8080 {
		t.Error("Default BindPort is wrong")
	}

	_ = os.Setenv("BindIP", "0.0.0.0")
	_ = os.Setenv("BindPort", "7777")

	c2 := conf.ServerConfig{}
	c2.LoadConfig()

	if c2.BindIP != "0.0.0.0" {
		t.Error("Set BindIP is wrong")
	}

	if c2.BindPort != 7777 {
		t.Error("Set BindPort is wrong")
	}

}
