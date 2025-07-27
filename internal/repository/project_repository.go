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

func (r *ProjectRepository) GetProjectById(id uint) (*models.Project, error) {
	var project models.Project
	err := r.db.First(&project, id).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *ProjectRepository) UpdateProject(project *models.Project) error {
	return r.db.Save(project).Error
}

func (r *ProjectRepository) DeleteProject(id uint) error {
	return r.db.Delete(&models.Project{}, id).Error
}

func (r *ProjectRepository) CheckProjectForUser(projectId, userId uint) (bool, error) {
	var count int64
	err := r.db.Model(&models.Project{}).Where("id = ? AND user_id = ?", projectId, userId).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
