package handler

import (
	"crypto/rand"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"math/big"
	"net/http"
	"time"
)

// GetSinglePlaySeedV1   godoc
// @Summary      Get Single play game seed
// @Description  Get Single play game seed
// @Tags         Game SinglePlay Endpoints
// @Accept       json
// @Produce      json
// @Success      200	{number}	i64
// @Failure      500	{object}	echo.HTTPError
// @Router       /v1/leaderboard [get]
func GetSinglePlaySeedV1(c echo.Context) BaseResponse {
	seed, err := rand.Int(rand.Reader, big.NewInt(time.Now().UnixNano()))
	if err != nil {
		return BaseResponse{
			http.StatusInternalServerError,
			nil,
			err,
		}
	}
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
	sess.Save(c.Request(), c.Response())

	return BaseResponse{
		http.StatusOK,
		seed,
		err,
	}
}
