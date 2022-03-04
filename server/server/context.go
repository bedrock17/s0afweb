package server

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type Server struct {
	Echo *echo.Echo
	DB   *gorm.DB
}

func Init(db *gorm.DB) *Server {
	return &Server{
		Echo: echo.New(),
		DB:   db,
	}
}

func (server *Server) Run(address string) error {
	return server.Echo.Start(address)
}
