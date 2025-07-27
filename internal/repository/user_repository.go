package repository

import (
	"github.com/aminasadiam/DevTasks/internal/models"
	"github.com/aminasadiam/DevTasks/internal/utils"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) AllUsers() []models.User {
	var users []models.User
	r.db.Find(&users)
	return users
}

func (r *UserRepository) GetUserByUsername(username string) (*models.User, bool) {
	var user models.User
	if err := r.db.Model(&models.User{}).Where("username = ?", username).Find(&user).Error; err != nil {
		return &models.User{}, false
	}
	return &user, true
}

func (r *UserRepository) LoginUser(username, password string) (*models.User, bool) {
	var user models.User
	if err := r.db.Model(&models.User{}).Where("username = ?", username).Find(&user).Error; err != nil {
		return &models.User{}, false
	}

	if !utils.VerifyPassword(password, user.Password) {
		return &models.User{}, false
	}

	return &user, true
}

func (r *UserRepository) ExistUsername(username string) bool {
	var count int64
	r.db.Model(&models.User{}).Where("username = ?", username).Count(&count)
	return count > 0
}

func (r *UserRepository) ExistEmail(email string) bool {
	var count int64
	r.db.Model(&models.User{}).Where("email = ?", email).Count(&count)
	return count > 0
}

func (r *UserRepository) Update(user *models.User) {
	r.db.Model(&models.User{}).Where("id = ?", user.ID).Save(user)
}

func (r *UserRepository) GetUserIdByUsername(username string) (userId uint) {
	var user models.User
	r.db.Model(models.User{}).Where("username = ?", username).Find(&user)
	userId = user.ID
	return
}
