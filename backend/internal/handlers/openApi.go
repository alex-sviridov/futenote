package handlers

import (
	"net/http"
)

// handleGetOpenAPI returns an [http.HandlerFunc] that serves the OpenAPI specification YAML file.
// The file is embedded in the binary using the go:embed directive.
func GetOpenAPI(openAPI []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/yaml")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(openAPI)
	}
}
