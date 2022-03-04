package conf

import (
	"strconv"
)
import "os"

type ServerConfig struct {
	BindIP   string
	BindPort int
}

func (s *ServerConfig) LoadConfig() {
	s.BindIP = os.Getenv("BindIP")

	if len(s.BindIP) == 0 {
		s.BindIP = "127.0.0.1"
	}

	port, err := strconv.Atoi(os.Getenv("BindPort"))

	if err != nil {
		port = 8080
	}

	s.BindPort = port
}
