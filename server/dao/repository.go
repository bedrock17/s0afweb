package dao

import (
	"github.com/bedrock17/s0afweb/dao/sql"
	"gorm.io/gorm"
)

var repo Repository

type Repository interface {
	Leaderboard() sql.LeaderboardRepository
}

type repositoryImpl struct {
	db *gorm.DB

	leaderboard sql.LeaderboardRepository
}

func InitRepository(db *gorm.DB) {
	repo = &repositoryImpl{
		db:          db,
		leaderboard: sql.New(db),
	}
}

func GetRepository() Repository {
	return repo
}

func (r *repositoryImpl) Leaderboard() sql.LeaderboardRepository {
	return r.Leaderboard()
}
