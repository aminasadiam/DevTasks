package api

import "github.com/aminasadiam/DevTasks/internal/repository"

var projectRepository repository.ProjectRepository

func init() {
	projectRepository = *repository.NewProjectRepository(DB)
}
