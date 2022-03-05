package handler

import (
	"github.com/bedrock17/s0afweb/dao"
	"github.com/bedrock17/s0afweb/models"
	"github.com/labstack/echo/v4"
	"net/http"
)

// GetLeaderboardV1   godoc
// @Summary      Get leaderboards
// @Description  Get current leaderboards
// @Tags         Leaderboard Endpoints
// @Accept       json
// @Produce      json
// @Success      200	{array}		models.Leaderboard
// @Failure      500	{object}	echo.HTTPError
// @Router       /v1/leaderboard [get]
func GetLeaderboardV1(c echo.Context) BaseResponse {
	repo := dao.GetRepository().Leaderboard()
	leaderboards, err := repo.GetAll()
	code := http.StatusOK
	if err != nil {
		code = http.StatusInternalServerError
	}

	return BaseResponse{
		code,
		leaderboards,
		err,
	}
}

// PostLeaderboardV1   godoc
// @Summary      Post leaderboard
// @Description  Register new leaderboard
// @Tags         Leaderboard Endpoints
// @Accept       json
// @Produce      json
// @Param        contest	body	models.Leaderboard	true	"Leaderboard Information (all required)"
// @Success      201	{object}	nil
// @Failure      400	{object}	echo.HTTPError
// @Failure      500	{object}	echo.HTTPError
// @Router       /v1/leaderboard [post]
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

	// TODO: Validate leaderboard score with seed and touch history
	//       if not valid, return http.StatusForbidden
	repo := dao.GetRepository().Leaderboard()
	err := repo.Create(*leaderboard)
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
