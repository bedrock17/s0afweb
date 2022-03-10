package handler

import (
	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func InitV1Handler(e *echo.Echo) {
	e.GET("v1/auth/google", RedirectGoogleSignInV1)
	e.GET("v1/auth/google/callback", GoogleSignInCallbackV1)
	e.GET("v1/auth/profile", BaseHandler(GetUserInfoV1))
	e.GET("v1/auth/logout", LogoutV1)

	e.GET("v1/seed", BaseHandler(GetSinglePlaySeedV1))

	e.POST("v1/room", BaseHandler(CreateGameRoomV1))

	e.GET("v1/leaderboard", BaseHandler(GetLeaderboardV1))
	e.POST("v1/leaderboard", BaseHandler(PostLeaderboardV1))

	e.GET("/swagger/*", echoSwagger.WrapHandler)
}
