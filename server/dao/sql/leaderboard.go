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
	result := r.db.Create(&data)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *leaderboardRepositoryImpl) GetAll() ([]models.Leaderboard, error) {
	var leaderboards []models.Leaderboard
	result := r.db.
		Order("score desc, touches asc, username asc").
		Find(&leaderboards)
	if result.Error != nil {
		return nil, result.Error
	}
	return leaderboards, nil
}
