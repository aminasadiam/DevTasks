package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/aminasadiam/DevTasks/internal/models"
	"github.com/aminasadiam/DevTasks/internal/repository"
	"github.com/aminasadiam/DevTasks/internal/utils"
)

var userRepository repository.UserRepository
var AuthError = errors.New("Unauthorized")

func GetUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(userRepository.AllUsers()); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	username := strings.TrimSpace(r.FormValue("username"))
	email := strings.TrimSpace(r.FormValue("email"))
	password := strings.TrimSpace(r.FormValue("password"))

	if username == "" || userRepository.ExistUsername(username) {
		http.Error(w, "Invalid Username", http.StatusNotAcceptable)
		return
	}

	if email == "" || !utils.IsValidEmail(email) || userRepository.ExistEmail(email) {
		http.Error(w, "Invalid Email", http.StatusNotAcceptable)
		return
	}

	if password == "" || !utils.IsValidPassword(password) {
		http.Error(w, "Invalid Password", http.StatusNotAcceptable)
		return
	}

	hashedPassword, _ := utils.HashPass(password)

	user := models.User{
		Username: username,
		Email:    email,
		Password: hashedPassword,
		Profile:  "Default.png",
	}

	if err := userRepository.Create(&user); err != nil {
		http.Error(w, "Failed to create new user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	username := strings.TrimSpace(r.FormValue("username"))
	password := strings.TrimSpace(r.FormValue("password"))

	user, ok := userRepository.LoginUser(username, password)
	if !ok {
		http.Error(w, "Invalid Username/Password", http.StatusUnauthorized)
		return
	}

	sessionToken := utils.GenerateToken(32)
	csrfToken := utils.GenerateToken(32)

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Expires:  time.Now().Add((24 * time.Hour) * 7),
		HttpOnly: false,
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
		Secure:   false, // Set to true in production with HTTPS
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "csrf_token",
		Value:    csrfToken,
		Expires:  time.Now().Add((24 * time.Hour) * 7),
		HttpOnly: false,
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
		Secure:   false, // Set to true in production with HTTPS
	})

	user.SessionToken = sessionToken
	user.CSRFToken = csrfToken
	userRepository.Update(user)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{"csrfToken": csrfToken})
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "csrf_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: false,
		SameSite: http.SameSiteStrictMode,
	})

	username := strings.TrimSpace(r.FormValue("username"))
	user, _ := userRepository.GetUserByUsername(username)
	user.SessionToken = ""
	user.CSRFToken = ""
	userRepository.Update(user)

	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode("Logged out Successfuly")
}

func Authorize(r *http.Request) error {
	username := strings.TrimSpace(r.FormValue("username"))
	user, ok := userRepository.GetUserByUsername(username)
	if !ok {
		return AuthError
	}

	st, err := r.Cookie("session_token")
	if err != nil || st.Value == "" || st.Value != user.SessionToken {
		return AuthError
	}

	csrf := r.Header.Get("X-CSRF-Token")
	if csrf == "" || csrf != user.CSRFToken {
		return AuthError
	}

	return nil
}

func ValidateSession(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := Authorize(r); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "valid"})
}
