package api

import (
	"encoding/json"
	"net/http"

	"github.com/aminasadiam/DevTasks/internal/repository"
)

var userRepository repository.UserRepository

func init() {
	userRepository = *repository.NewUserRepository(DB)
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(userRepository.AllUsers()); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}
