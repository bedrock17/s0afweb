package handler

import (
	"github.com/bedrock17/s0afweb/models"
	"github.com/bedrock17/s0afweb/server"
	"github.com/labstack/echo/v4"
	"net/http"
)

type LeaderboardHandler struct {
	server *server.Server
}

func MakeLeaderboardHandler(server *server.Server) *LeaderboardHandler {
	return &LeaderboardHandler{server: server}
}

// GetLeaderboardV1   godoc
// @Summary      Get leaderboards
// @Description  Get current leaderboards
// @Tags         Leaderboard Endpoints
// @Accept       json
// @Produce      json
// @Success      200	{array}		models.Leaderboard
// @Failure      500	{object}	echo.HTTPError
// @Router       /v1/leaderboard [get]
func (l *LeaderboardHandler) GetLeaderboardV1(c echo.Context) error {
	var leaderboards []models.Leaderboard

	result := l.server.DB.
		Order("score desc, touches asc, username asc").
		Find(&leaderboards)

	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, result.Error.Error())
	}

	return c.JSON(http.StatusOK, leaderboards)
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
func (l *LeaderboardHandler) PostLeaderboardV1(c echo.Context) error {
	var leaderboard models.Leaderboard

	if err := (&echo.DefaultBinder{}).BindBody(c, &leaderboard); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	// TODO: Use validator or another way
	if leaderboard.Username == "" {
		return c.JSON(http.StatusNotAcceptable, nil)
	}

	// TODO: Validate leaderboard score with seed and touch history
	// if not valid, return http.StatusForbidden

	result := l.server.DB.
		Create(&leaderboard)

	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, result.Error.Error())
	}

	return c.JSON(http.StatusCreated, nil)
}
