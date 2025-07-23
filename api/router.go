package api

import (
	"fmt"
	"log"
	"net/http"

	"github.com/aminasadiam/DevTasks/config"
	"github.com/aminasadiam/DevTasks/internal/database"
	"gorm.io/gorm"
)

var DB *gorm.DB

func init() {
	cfg := config.LoadDbConfig()
	DB = database.InitDB(cfg)
}

func Serve(config *config.ServerConfig) error {
	mux := http.NewServeMux()

	//Routes

	// User Routes
	mux.HandleFunc("GET /api/users", GetUsers)

	log.Printf("server started at %v\n", config.Port)
	return http.ListenAndServe(fmt.Sprintf(":%s", config.Port), mux)
}
