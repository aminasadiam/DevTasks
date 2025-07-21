package main

import (
	"log"
	"net/http"

	"github.com/aminasadiam/DevTasks/api"
	"github.com/aminasadiam/DevTasks/config"
)

func init() {
	err := config.Load()
	if err != nil {
		log.Fatalf("unable load configs: %v", err)
	}
}

func main() {
	mux := http.NewServeMux()

	//Routes
	mux.HandleFunc("/api/test", api.TestHandler)

	log.Printf("server started at %v\n", config.Port)
	log.Fatal(http.ListenAndServe(config.Port, mux))
}
