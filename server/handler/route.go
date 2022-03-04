package handler

import "github.com/labstack/echo/v4"

func InitV1Handler(e *echo.Echo) {
	e.GET("v1/leaderboard", GetLeaderboardV1)
	e.POST("v1/leaderboard", PostLeaderboardV1)
}
