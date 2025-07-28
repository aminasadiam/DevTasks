package api

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/aminasadiam/DevTasks/config"
	"github.com/aminasadiam/DevTasks/internal/database"
	"github.com/aminasadiam/DevTasks/internal/repository"
	"github.com/rs/cors"
	"gorm.io/gorm"
)

var DB *gorm.DB

func init() {
	cfg := config.LoadDbConfig()
	DB = database.InitDB(cfg)

	userRepository = *repository.NewUserRepository(DB)
	projectRepository = *repository.NewProjectRepository(DB)
	taskRepository = *repository.NewTaskRepository(DB)
}

func Serve(config *config.ServerConfig) error {
	mux := http.NewServeMux()

	// Routes
	// User Routes
	mux.HandleFunc("GET /api/users", GetUsers)
	mux.HandleFunc("POST /api/register", RegisterHandler)
	mux.HandleFunc("POST /api/login", LoginHandler)
	mux.HandleFunc("/api/logout", LogoutHandler)
	mux.HandleFunc("POST /api/validate", ValidateSession)

	// Projects Routes
	mux.HandleFunc("GET /api/projects", GetProjects)
	mux.HandleFunc("POST /api/add-project", AddProject)
	mux.HandleFunc("GET /api/project", GetProjectById)
	mux.HandleFunc("PUT /api/update-project", UpdateProject)
	mux.HandleFunc("DELETE /api/delete-project", DeleteProject)

	// Tasks Routes
	mux.HandleFunc("GET /api/tasks", GetTasks)
	mux.HandleFunc("POST /api/add-task", AddTask)
	mux.HandleFunc("GET /api/task", GetTaskById)
	mux.HandleFunc("PUT /api/update-task", UpdateTask)
	mux.HandleFunc("DELETE /api/delete-task", DeleteTask)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3030"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "X-CSRF-Token", "application/x-www-form-urlencoded"},
		AllowCredentials: true,
	})

	handler := c.Handler(mux)

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", config.Port),
		Handler: handler,
	}

	// Channel to listen for interrupt signals
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM, syscall.SIGQUIT) // Added SIGQUIT for Ctrl+Q

	go func() {
		log.Printf("server started at %v\n", config.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v\n", err)
		}
	}()

	// Wait for interrupt signal
	<-quit
	log.Println("shutting down server...")

	// Create a context with timeout for graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Shutdown the server
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("server shutdown failed: %v\n", err)
	}
	log.Println("server stopped")

	return nil
}
