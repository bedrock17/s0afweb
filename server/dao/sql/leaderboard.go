package sql

import (
	"github.com/bedrock17/s0afweb/models"
	"gorm.io/gorm"
)

type LeaderboardRepository interface {
	Create(data models.Leaderboard) error

	GetAll() ([]models.Leaderboard, error)
}

type leaderboardRepositoryImpl struct {
	db *gorm.DB
}

func New(db *gorm.DB) LeaderboardRepository {
	return &leaderboardRepositoryImpl{db: db}
}

func (r *leaderboardRepositoryImpl) Create(data models.Leaderboard) error {
	var leaderboard models.Leaderboard

	result := r.db.FirstOrCreate(&leaderboard, models.Leaderboard{Username: data.Username})
	if result.Error != nil {
		return result.Error
	}

	if leaderboard.Score < data.Score || (leaderboard.Score == data.Score && leaderboard.Touches > data.Touches) {
		leaderboard.Score = data.Score
		leaderboard.Touches = data.Touches
		leaderboard.TouchHistory = data.TouchHistory
	}

	result = r.db.Save(&leaderboard)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (r *leaderboardRepositoryImpl) GetAll() ([]models.Leaderboard, error) {
	var leaderboards []models.Leaderboard
	result := r.db.
		Order("score desc, touches asc, created_at asc").
		Limit(200).
		Find(&leaderboards)
	if result.Error != nil {
		return nil, result.Error
	}
	return leaderboards, nil
}
