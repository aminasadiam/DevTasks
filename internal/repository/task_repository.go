package repository

import (
	"github.com/aminasadiam/DevTasks/internal/models"
	"gorm.io/gorm"
)

type TaskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) *TaskRepository {
	return &TaskRepository{
		db: db,
	}
}

func (r *TaskRepository) Create(task *models.Task) error {
	return r.db.Create(task).Error
}
