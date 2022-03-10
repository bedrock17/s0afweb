package handler

import (
	"github.com/bedrock17/s0afweb/service"
	"github.com/bedrock17/s0afweb/service/game"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"math/rand"
	"net/http"
)

// GetSinglePlaySeedV1   godoc
// @Summary      Get Single play game seed
// @Description  Get Single play game seed
// @Tags         Game SinglePlay Endpoints
// @Accept       json
// @Produce      json
// @Success      200	{object}	BaseHttpResponse{data=int32}
// @Failure      500	{object}	BaseHttpResponse{error=string}
// @Router       /seed [get]
func GetSinglePlaySeedV1(c echo.Context) BaseResponse {
	seed := rand.Int31()%2147483646 + 1
	sess, err := session.Get("session", c)
	if err != nil {
		return BaseResponse{
			http.StatusInternalServerError,
			nil,
			err,
		}
	}
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
	}
	sess.Values["seed"] = seed
	if err := sess.Save(c.Request(), c.Response()); err != nil {
		return BaseResponse{
			http.StatusInternalServerError,
			nil,
			err,
		}
	}

	return BaseResponse{
		http.StatusOK,
		seed,
		err,
	}
}

type CreateGameRoomV1Response struct {
	game.Room
}

func CreateGameRoomV1(c echo.Context) BaseResponse {
	request := new(game.CreateRoomConfig)

	if err := c.Bind(request); err != nil {
		return BaseResponse{
			http.StatusBadRequest,
			nil,
			err,
		}
	}

	if err := c.Validate(request); err != nil {
		return BaseResponse{
			http.StatusBadRequest,
			nil,
			err,
		}
	}

	gameRoomManager := service.GetService().GameRoomManager()
	room := gameRoomManager.NewRoom(*request)
	return BaseResponse{
		http.StatusOK,
		room,
		nil,
	}
}
