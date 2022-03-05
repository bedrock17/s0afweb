package handler

import (
	"crypto/rand"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"math"
	"math/big"
	"net/http"
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
	seed, err := rand.Int(rand.Reader, big.NewInt(math.MaxUint64))
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
