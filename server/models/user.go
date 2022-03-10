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
	UserId     string         `json:"tag" gorm:"primaryKey"`
	CreatedAt  time.Time      `swaggerignore:"true"`
	UpdatedAt  time.Time      `swaggerignore:"true"`
	DeletedAt  gorm.DeletedAt `swaggerignore:"true" gorm:"index"`
}
