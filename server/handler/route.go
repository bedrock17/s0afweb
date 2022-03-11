package handler

import (
	"github.com/bedrock17/s0afweb/handler/ws"
	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func InitV1Handler(e *echo.Echo) {
	e.GET("v1/auth/google", RedirectGoogleSignInV1)
	e.GET("v1/auth/google/callback", GoogleSignInCallbackV1)
	e.GET("v1/auth/profile", BaseHandler(GetUserInfoV1))
	e.GET("v1/auth/logout", LogoutV1)

	e.GET("v1/seed", BaseHandler(GetSinglePlaySeedV1))

	e.GET("v1/leaderboard", BaseHandler(GetLeaderboardV1))
	e.POST("v1/leaderboard", BaseHandler(PostLeaderboardV1))

	e.GET("/v1/ws", ws.WebSocketHandlerV1)

	e.GET("/swagger/*", echoSwagger.WrapHandler)
}
