package dao

import (
	"github.com/bedrock17/s0afweb/dao/sql"
	"gorm.io/gorm"
)

var repo Repository

type Repository interface {
	Leaderboard() sql.LeaderboardRepository
	User() sql.UserRepository
}

type repositoryImpl struct {
	db *gorm.DB

	leaderboard sql.LeaderboardRepository
	user        sql.UserRepository
}

func InitRepository(db *gorm.DB) {
	repo = &repositoryImpl{
		db:          db,
		leaderboard: sql.NewLeaderboardRepository(db),
		user:        sql.NewUserRepository(db),
	}
}

func GetRepository() Repository {
	return repo
}

func (r *repositoryImpl) Leaderboard() sql.LeaderboardRepository {
	return r.leaderboard
}

func (r *repositoryImpl) User() sql.UserRepository {
	return r.user
}
