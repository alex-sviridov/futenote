package handlers

import (
	"encoding/json"
	"net/http"
	"runtime/debug"
	"time"
)

// handleGetHealth returns an [http.HandlerFunc] that responds with the health status of the service.
// It includes the service version, VCS revision, build time, and modified status.
// The service version can be set at build time using the VERSION variable (e.g., 'make build VERSION=v1.0.0').
func GetHealth() http.HandlerFunc {
	type responseBody struct {
		Uptime         string    `json:"Uptime"`
		LastCommitHash string    `json:"LastCommitHash"`
		LastCommitTime time.Time `json:"LastCommitTime"`
		DirtyBuild     bool      `json:"DirtyBuild"`
	}

	res := responseBody{}
	buildInfo, _ := debug.ReadBuildInfo()
	for _, kv := range buildInfo.Settings {
		if kv.Value == "" {
			continue
		}
		switch kv.Key {
		case "vcs.revision":
			res.LastCommitHash = kv.Value
		case "vcs.time":
			res.LastCommitTime, _ = time.Parse(time.RFC3339, kv.Value)
		case "vcs.modified":
			res.DirtyBuild = kv.Value == "true"
		}
	}

	up := time.Now()
	return func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		res.Uptime = time.Since(up).String()
		if err := json.NewEncoder(w).Encode(res); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}
