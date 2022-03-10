package sql

import (
	"github.com/bedrock17/s0afweb/models"
	"github.com/bedrock17/s0afweb/service/auth"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetOrCreate(user *models.User) error

	Get(user, condition *models.User)
}

type userRepositoryImpl struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepositoryImpl{db: db}
}

func (r *userRepositoryImpl) GetOrCreate(user *models.User) error {
	userId := auth.GenerateRandomString(6)
	result := r.db.Where(&user).Attrs(models.User{UserId: userId}).FirstOrCreate(&user)
	return result.Error
}

func (r *userRepositoryImpl) Get(user, condition *models.User) {
	r.db.Where(condition).Find(user)
}
