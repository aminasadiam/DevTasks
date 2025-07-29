package api

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/aminasadiam/DevTasks/internal/models"
	"github.com/aminasadiam/DevTasks/internal/repository"
)

var projectRepository repository.ProjectRepository

func GetProjects(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
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

func GetProjectById(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	username := strings.TrimSpace(r.FormValue("username"))
	projectIdStr := r.FormValue("project_id")
	if projectIdStr == "" {
		http.Error(w, "Project ID is required", http.StatusBadRequest)
		return
	}

	projectId, err := strconv.Atoi(projectIdStr)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	userId := userRepository.GetUserIdByUsername(username)
	exists, err := projectRepository.CheckProjectForUser(uint(projectId), userId)
	if err != nil {
		http.Error(w, "Failed to check project ownership", http.StatusInternalServerError)
		return
	}
	if !exists {
		http.Error(w, "Project not found for this user", http.StatusNotFound)
		return
	}
	project, err := projectRepository.GetProjectById(uint(projectId))
	if err != nil {
		http.Error(w, "Failed to get project", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(project); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func UpdateProject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	username := strings.TrimSpace(r.FormValue("username"))
	projectIdStr := r.FormValue("project_id")
	name := r.FormValue("name")
	description := r.FormValue("description")

	if projectIdStr == "" || name == "" || description == "" {
		http.Error(w, "Project ID, name, and description are required", http.StatusBadRequest)
		return
	}

	projectId, err := strconv.Atoi(projectIdStr)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	userId := userRepository.GetUserIdByUsername(username)
	exists, err := projectRepository.CheckProjectForUser(uint(projectId), userId)
	if err != nil {
		http.Error(w, "Failed to check project ownership", http.StatusInternalServerError)
		return
	}
	if !exists {
		http.Error(w, "Project not found for this user", http.StatusNotFound)
		return
	}

	project, _ := projectRepository.GetProjectById(uint(projectId))
	if project == nil {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	project.Name = name
	project.Description = description

	if err := projectRepository.UpdateProject(project); err != nil {
		http.Error(w, "Failed to update project", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{
		"message": "Project updated successfully",
	}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func DeleteProject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	username := strings.TrimSpace(r.FormValue("username"))
	projectIdStr := r.FormValue("project_id")
	if projectIdStr == "" {
		http.Error(w, "Project ID is required", http.StatusBadRequest)
		return
	}

	projectId, err := strconv.Atoi(projectIdStr)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	userId := userRepository.GetUserIdByUsername(username)
	exists, err := projectRepository.CheckProjectForUser(uint(projectId), userId)
	if err != nil {
		http.Error(w, "Failed to check project ownership", http.StatusInternalServerError)
		return
	}
	if !exists {
		http.Error(w, "Project not found for this user", http.StatusNotFound)
		return
	}

	if err := projectRepository.DeleteProject(uint(projectId)); err != nil {
		http.Error(w, "Failed to delete project", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{
		"message": "Project deleted successfully",
	}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}
