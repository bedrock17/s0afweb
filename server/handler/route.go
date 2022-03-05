package handler

import (
	"github.com/labstack/echo/v4"
)

func InitV1Handler(e *echo.Echo) {
	e.GET("v1/leaderboard", BaseHandler(GetLeaderboardV1))
	e.POST("v1/leaderboard", BaseHandler(PostLeaderboardV1))
}
