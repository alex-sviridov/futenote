package server

import (
	"github.com/alex-sviridov/futenote/internal/handlers"
	"log/slog"
	"net/http"
)

// route sets up and returns an [http.Handler] for all the server routes.
// It is the single source of truth for all the routes.
func route(log *slog.Logger, embedded map[string][]byte) http.Handler {
	mux := http.NewServeMux()
	mux.Handle("GET /health", handlers.GetHealth())
	mux.Handle("GET /openapi.yaml", handlers.GetOpenAPI(embedded["openAPI"]))
	mux.Handle("/debug/", handlers.GetDebug())

	handler := accesslog(mux, log)
	handler = recovery(handler, log)
	return handler
}
