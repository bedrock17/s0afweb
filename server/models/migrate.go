package models

import "gorm.io/gorm"

func Migrate(db *gorm.DB) {
	err := db.AutoMigrate(&Leaderboard{}, &User{})
	if err != nil {
		panic("failed to auto migration")
	}
}
