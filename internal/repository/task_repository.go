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

func (r *TaskRepository) GetProjectTasks(projectId uint) ([]models.Task, error) {
	var tasks []models.Task
	err := r.db.Model(&models.Task{}).Where("project_id = ?", projectId).Find(&tasks).Error
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (r *TaskRepository) GetTaskById(id uint) (*models.Task, error) {
	var task models.Task
	err := r.db.First(&task, id).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (r *TaskRepository) UpdateTask(task *models.Task) error {
	return r.db.Save(task).Error
}

func (r *TaskRepository) DeleteTask(id uint) error {
	return r.db.Delete(&models.Task{}, id).Error
}

func (r *TaskRepository) CheckTaskForProject(taskId, projectId uint) (bool, error) {
	var count int64
	err := r.db.Model(&models.Task{}).Where("id = ? AND project_id = ?", taskId, projectId).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *TaskRepository) CheckTaskForUser(taskId, userId uint) (bool, error) {
	var count int64
	err := r.db.Model(&models.Task{}).Where("id = ? AND user_id = ?", taskId, userId).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *TaskRepository) GetTasksByUserId(userId uint) ([]models.Task, error) {
	var tasks []models.Task
	err := r.db.Model(&models.Task{}).Where("user_id = ?", userId).Find(&tasks).Error
	if err != nil {
		return nil, err
	}
	return tasks, nil
}
