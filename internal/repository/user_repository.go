package repository

import (
	"github.com/aminasadiam/DevTasks/internal/models"
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
