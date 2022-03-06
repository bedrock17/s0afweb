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
	gorm.Model   `swaggerignore:"true"`
	Username     string `gorm:"primaryKey" json:"username" validate:"required,min=1,max=32"`
	Score        int    `json:"score" validate:"required,numeric"`
	Touches      int    `json:"touches" validate:"required,numeric"`
	TouchHistory string `json:"touch_history" gorm:"type:text" validate:"required,json"`
	Seed         int32  `json:"seed" validate:"required,numeric"`
}
