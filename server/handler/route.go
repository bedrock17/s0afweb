package handler

import (
	"github.com/bedrock17/s0afweb/server"
)

func InitV1Handler(server *server.Server) {
	leaderboardHandler := MakeLeaderboardHandler(server)

	e := server.Echo
	e.GET("v1/leaderboard", leaderboardHandler.GetLeaderboardV1)
	e.POST("v1/leaderboard", leaderboardHandler.PostLeaderboardV1)
}
