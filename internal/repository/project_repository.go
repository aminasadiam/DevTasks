package repository

import (
	"github.com/aminasadiam/DevTasks/internal/models"
	"gorm.io/gorm"
)

type ProjectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) *ProjectRepository {
	return &ProjectRepository{
		db: db,
	}
}

func (r *ProjectRepository) Create(project *models.Project) error {
	return r.db.Create(project).Error
}

func (r *ProjectRepository) GetUserProjects(userId uint) ([]models.Project, error) {
	var projects []models.Project
	err := r.db.Model(&models.Project{}).Where("user_id = ?", userId).Find(&projects).Error
	if err != nil {
		return nil, err
	}
	return projects, nil
}

func (r *ProjectRepository) AddProject(project *models.Project) error {
	if err := r.db.Create(project).Error; err != nil {
		return err
	}
	return nil
}
