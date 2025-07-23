package api

import "github.com/aminasadiam/DevTasks/internal/repository"

var taskRepository repository.TaskRepository

func init() {
	taskRepository = *repository.NewTaskRepository(DB)
}
