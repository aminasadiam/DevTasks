package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/aminasadiam/DevTasks/internal/models"
	"github.com/aminasadiam/DevTasks/internal/repository"
)

var projectRepository repository.ProjectRepository

func GetProjects(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	username := strings.TrimSpace(r.FormValue("username"))
	userId := userRepository.GetUserIdByUsername(username)
	projects, err := projectRepository.GetUserProjects(userId)
	if err != nil {
		http.Error(w, "failed to get projects", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(projects); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func AddProject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	username := strings.TrimSpace(r.FormValue("username"))
	name := r.FormValue("name")
	description := r.FormValue("description")

	if name == "" || description == "" {
		http.Error(w, "Name and description are required", http.StatusBadRequest)
		return
	}

	userId := userRepository.GetUserIdByUsername(username)

	project := models.Project{
		Name:        name,
		Description: description,
		UserId:      userId,
	}

	if err := projectRepository.AddProject(&project); err != nil {
		http.Error(w, "Failed to add project", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{
		"message": "Project added successfully",
		"project": project.Name,
	}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}
