package config

import (
	"os"

	"github.com/joho/godotenv"
)

var (
	Port string
)

func Load() error {
	err := godotenv.Load()
	if err != nil {
		return err
	}

	Port = os.Getenv("PORT")

	return nil
}
