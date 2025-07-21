package api

import (
	"fmt"
	"net/http"
)

func TestHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "This is Test Api Route")
}
