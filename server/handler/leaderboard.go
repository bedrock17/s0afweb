package handler

import (
	"errors"
	"github.com/bedrock17/s0afweb/dao"
	"github.com/bedrock17/s0afweb/game"
	"github.com/bedrock17/s0afweb/models"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"net/http"
)

type LeaderboardResponse struct {
	Username string `json:"username" validate:"required,min=1,max=32"`
	Score    int    `json:"score" validate:"required,numeric"`
	Touches  int    `json:"touches" validate:"required,numeric"`
}

// GetLeaderboardV1   godoc
// @Summary      Get leaderboards
// @Description  Get current leaderboards
// @Tags         Leaderboard Endpoints
// @Accept       json
// @Produce      json
// @Success      200	{object}	BaseHttpResponse{data=[]LeaderboardResponse}
// @Failure      500	{object}	BaseHttpResponse{error=string}
// @Router       /leaderboard [get]
func GetLeaderboardV1(c echo.Context) BaseResponse {
	repo := dao.GetRepository().Leaderboard()
	leaderboards, err := repo.GetAll()
	code := http.StatusOK
	if err != nil {
		code = http.StatusInternalServerError
	}

	leaderboardsResponse := make([]LeaderboardResponse, len(leaderboards))

	for i, e := range leaderboards {
		leaderboardsResponse[i] = LeaderboardResponse{
			Username: e.Username,
			Score:    e.Score,
			Touches:  e.Touches,
		}
	}

	return BaseResponse{
		code,
		leaderboardsResponse,
		err,
	}
}

// PostLeaderboardV1   godoc
// @Summary      Post leaderboard
// @Description  Register new score (if username exists, update score)
// @Tags         Leaderboard Endpoints
// @Accept       json
// @Produce      json
// @Param        data	body	models.Leaderboard	true	"Leaderboard Information (all required)"
// @Success      201	{object}	nil
// @Failure      400	{object}	BaseHttpResponse{error=string}
// @Failure      500	{object}	BaseHttpResponse{error=string}
// @Router       /leaderboard [post]
func PostLeaderboardV1(c echo.Context) BaseResponse {
	leaderboard := new(models.Leaderboard)

	if err := c.Bind(leaderboard); err != nil {
		return BaseResponse{
			http.StatusBadRequest,
			nil,
			err,
		}
	}

	if err := c.Validate(leaderboard); err != nil {
		return BaseResponse{
			http.StatusBadRequest,
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
	seed := sess.Values["seed"]
	seed = seed.(int32)
	if leaderboard.Seed != seed {
		return BaseResponse{
			http.StatusBadRequest,
			nil,
			err,
		}
	}

	validGame := game.Validate(leaderboard)
	if !validGame {
		return BaseResponse{
			http.StatusBadRequest,
			nil,
			errors.New("invalid game"),
		}
	}

	repo := dao.GetRepository().Leaderboard()
	err = repo.CreateOrUpdate(*leaderboard)
	code := http.StatusCreated
	if err != nil {
		code = http.StatusInternalServerError
	}

	return BaseResponse{
		code,
		nil,
		err,
	}
}
