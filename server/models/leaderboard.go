package models

import (
	"gorm.io/gorm"
)

type Point struct {
	X int
	Y int
}

// Leaderboard Information of leaderboard
// @Description leaderboard model
type Leaderboard struct {
	gorm.Model
	Username     string `json:"username" validate:"required,max=32"`
	Score        int    `json:"score" validate:"required;numeric"`
	Touches      int    `json:"touches" validate:"required;numeric"`
	TouchHistory string `json:"touch_history" gorm:"type:text"`
	Seed         uint64 `json:"seed" validate:"required;numeric"`
}
