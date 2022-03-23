package models

import (
	"gorm.io/gorm"
	"time"
)

type Provider string

const (
	GoogleIdP Provider = "google"
)

type User struct {
	Provider   Provider
	ExternalId string         `json:"external_id"`
	UserID     string         `json:"tag" gorm:"primaryKey"`
	Username   string         `json:"username" gorm:"index"`
	CreatedAt  time.Time      `swaggerignore:"true"`
	UpdatedAt  time.Time      `swaggerignore:"true"`
	DeletedAt  gorm.DeletedAt `swaggerignore:"true" gorm:"index"`
}
