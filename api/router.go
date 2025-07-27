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

	// Projects Routes
	mux.HandleFunc("GET /api/projects", GetProjects)
	mux.HandleFunc("POST /api/add-project", AddProject)
	mux.HandleFunc("GET /api/project", GetProjectById)
	mux.HandleFunc("PUT /api/update-project", UpdateProject)
	mux.HandleFunc("DELETE /api/delete-project", DeleteProject)

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", config.Port),
		Handler: mux,
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
