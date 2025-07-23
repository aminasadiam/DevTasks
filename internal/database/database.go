package database

import (
	"fmt"
	"log"

	"github.com/aminasadiam/DevTasks/config"
	"github.com/aminasadiam/DevTasks/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB(cfg *config.DbConfig) *gorm.DB {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	log.Println("Connected to Database.")

	db.AutoMigrate(&models.User{}, &models.Project{}, &models.Task{})

	log.Println("Successful Migration.")

	return db
}
