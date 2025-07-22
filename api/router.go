package api

import (
	"fmt"
	"log"
	"net/http"

	"github.com/aminasadiam/DevTasks/config"
)

func Serve(config *config.ServerConfig) error {
	mux := http.NewServeMux()

	//Routes
	mux.HandleFunc("/api/test", TestHandler)

	log.Printf("server started at %v\n", config.Port)
	return http.ListenAndServe(fmt.Sprintf(":%s", config.Port), mux)
}
