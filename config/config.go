package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type DbConfig struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
}

type ServerConfig struct {
	Port string
}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Unable to load env file: %v", err)
	}
}

func LoadDbConfig() *DbConfig {
	return &DbConfig{
		DBHost:     os.Getenv("DBHOST"),
		DBPort:     os.Getenv("DBPORT"),
		DBUser:     os.Getenv("DBUSER"),
		DBPassword: os.Getenv("DBPASS"),
		DBName:     os.Getenv("DBNAME"),
	}
}

func LoadServerConfig() *ServerConfig {
	return &ServerConfig{
		Port: os.Getenv("SERVERPORT"),
	}
}
