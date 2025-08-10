package api

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/aminasadiam/DevTasks/internal/models"
	"github.com/aminasadiam/DevTasks/internal/repository"
)

var taskRepository repository.TaskRepository

func GetTasks(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	projectIdStr := r.FormValue("project_id")
	projectId, err := strconv.Atoi(projectIdStr)
	if err != nil || projectId <= 0 {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	tasks, err := taskRepository.GetProjectTasks(uint(projectId))
	if err != nil {
		http.Error(w, "Failed to get tasks", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(tasks); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func AddTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	projectIdStr := r.FormValue("project_id")
	projectId, err := strconv.Atoi(projectIdStr)
	if err != nil || projectId <= 0 {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	title := r.FormValue("title")
	description := r.FormValue("description")

	if title == "" || description == "" {
		http.Error(w, "Name and description are required", http.StatusBadRequest)
		return
	}

	task := &models.Task{
		Title:       title,
		Description: description,
		ProjectId:   uint(projectId),
		AssignedTo:  userRepository.GetUserIdByUsername(r.FormValue("username")),
	}

	if err := taskRepository.Create(task); err != nil {
		http.Error(w, "Failed to add task", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(task); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func GetTaskById(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Handle authorization for both GET and POST
	var username string
	if r.Method == http.MethodGet {
		username = r.URL.Query().Get("username")
	} else {
		username = r.FormValue("username")
	}

	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	// Check if user exists and validate session
	user, ok := userRepository.GetUserByUsername(username)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	st, err := r.Cookie("session_token")
	if err != nil || st.Value == "" || st.Value != user.SessionToken {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	csrf := r.Header.Get("X-CSRF-Token")
	if csrf == "" || csrf != user.CSRFToken {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var taskIdStr string
	if r.Method == http.MethodGet {
		taskIdStr = r.URL.Query().Get("task_id")
	} else {
		taskIdStr = r.FormValue("task_id")
	}

	if taskIdStr == "" {
		http.Error(w, "Task ID is required", http.StatusBadRequest)
		return
	}

	taskId, err := strconv.Atoi(taskIdStr)
	if err != nil || taskId <= 0 {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	task, err := taskRepository.GetTaskById(uint(taskId))
	if err != nil {
		http.Error(w, "Failed to get task", http.StatusInternalServerError)
		return
	}

	if task == nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(task); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	taskIdStr := r.FormValue("task_id")
	taskId, err := strconv.Atoi(taskIdStr)
	if err != nil || taskId <= 0 {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	title := r.FormValue("title")
	description := r.FormValue("description")

	if title == "" || description == "" {
		http.Error(w, "Title and description are required", http.StatusBadRequest)
		return
	}

	task, err := taskRepository.GetTaskById(uint(taskId))
	if err != nil {
		http.Error(w, "Failed to get task", http.StatusInternalServerError)
		return
	}

	if task == nil {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	task.Title = title
	task.Description = description

	if err := taskRepository.UpdateTask(task); err != nil {
		http.Error(w, "Failed to update task", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(task); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	taskIdStr := r.FormValue("task_id")
	taskId, err := strconv.Atoi(taskIdStr)
	if err != nil || taskId <= 0 {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	if err := taskRepository.DeleteTask(uint(taskId)); err != nil {
		http.Error(w, "Failed to delete task", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
