package models

import "gorm.io/gorm"

type Pos struct {
	X int
	Y int
}

type Leaderboard struct {
	gorm.Model
	Username     string `json:"username"`
	Score        int    `json:"score"`
	Touches      int    `json:"touches"`
	TouchHistory []Pos  `json:"touch_history"`
	Seed         int64  `json:"seed"`
}
