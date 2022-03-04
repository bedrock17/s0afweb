package handler

import (
	"github.com/bedrock17/s0afweb/server"
)

func InitV1Handler(server *server.Server) {
	e := server.Echo
	e.GET("v1/leaderboard", GetLeaderboardV1)
	e.POST("v1/leaderboard", PostLeaderboardV1)
}
