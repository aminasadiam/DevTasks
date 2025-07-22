package main

import (
	"log"

	"github.com/aminasadiam/DevTasks/api"
	"github.com/aminasadiam/DevTasks/config"
)

func main() {
	cfg := config.LoadServerConfig()

	err := api.Serve(cfg)
	if err != nil {
		log.Fatal(err)
	}
}
