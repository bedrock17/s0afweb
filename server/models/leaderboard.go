package models

import (
	"gorm.io/gorm"
)

type Point struct {
	X int
	Y int
}

type Leaderboard struct {
	gorm.Model
	Username     string `json:"username"`
	Score        int    `json:"score"`
	Touches      int    `json:"touches"`
	TouchHistory string `json:"touch_history" gorm:"type:text"`
	Seed         int64  `json:"seed"`
}
