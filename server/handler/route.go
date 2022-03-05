package handler

import (
	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func InitV1Handler(e *echo.Echo) {
	e.GET("v1/leaderboard", BaseHandler(GetLeaderboardV1))
	e.POST("v1/leaderboard", BaseHandler(PostLeaderboardV1))

	e.GET("/swagger/*", echoSwagger.WrapHandler)
}
