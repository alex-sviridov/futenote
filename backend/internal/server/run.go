package server

import (
	"context"
	"flag"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os/signal"
	"syscall"
	"time"
)

// run initiates and starts the [http.Server], blocking until the context is canceled by OS signals.
// It listens on a port specified by the -port flag, defaulting to 8080.
func Run(ctx context.Context, w io.Writer, args []string, embedded map[string][]byte) error {
	var port uint
	fs := flag.NewFlagSet(args[0], flag.ExitOnError)
	fs.SetOutput(w)
	fs.UintVar(&port, "port", 8080, "port for HTTP API")
	if err := fs.Parse(args[1:]); err != nil {
		return err
	}

	ctx, cancel := signal.NotifyContext(ctx, syscall.SIGINT, syscall.SIGTERM)

	// Initialize your resources here, for example:
	// db, err := sql.Open(...)
	// if err != nil {
	//     return fmt.Errorf("database init: %w", err)
	// }

	slog.SetDefault(slog.New(slog.NewJSONHandler(w, nil)))
	server := &http.Server{
		Addr:              fmt.Sprintf(":%d", port),
		Handler:           route(slog.Default(), embedded),
		ReadHeaderTimeout: 10 * time.Second,
	}

	errChan := make(chan error, 1)
	go func() {
		slog.InfoContext(ctx, "server started", slog.Uint64("port", uint64(port)))
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			errChan <- err
		}
	}()

	select {
	case err := <-errChan:
		return err
	case <-ctx.Done():
		slog.InfoContext(ctx, "shutting down server")

		// Create a new context for shutdown with timeout
		ctx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer shutdownCancel()

		// Shutdown the HTTP server first
		if err := server.Shutdown(ctx); err != nil {
			return fmt.Errorf("server shutdown: %w", err)
		}

		// After server is shutdown, cancel the main context to close other resources
		cancel()

		// Add cleanup code here, in reverse order of initialization
		// For example, close database connections
		// if err := db.Close(); err != nil {
		//     return fmt.Errorf("database shutdown: %w", err)
		// }
		return nil
	}
}
