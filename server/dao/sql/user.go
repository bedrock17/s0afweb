package sql

import (
	"github.com/bedrock17/s0afweb/models"
	"github.com/bedrock17/s0afweb/utils"
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
	userId := utils.GenerateRandomString(6)
	for {
		result := r.db.Where(&models.User{UserID: userId}).First(nil)
		if result.RowsAffected == 0 {
			break
		}
	}

	whereCondition := *user
	user.Username = userId
	result := r.db.Where(&whereCondition).Attrs(models.User{UserID: userId}).FirstOrCreate(&user)
	return result.Error
}

func (r *userRepositoryImpl) Get(user, condition *models.User) {
	r.db.Where(condition).Find(user)
}
