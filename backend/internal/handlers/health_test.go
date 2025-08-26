package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestGetHealth(t *testing.T) {
	tests := []struct {
		name           string
		version        string
		expectedStatus int
		expectedType   string
	}{
		{
			name:           "test health",
			expectedStatus: http.StatusOK,
			expectedType:   "application/json",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Arrange
			handler := GetHealth()
			w := makeRequest(handler)

			// Assert
			if w.Code != tt.expectedStatus {
				t.Errorf("expected status %d, got %d", tt.expectedStatus, w.Code)
			}

			if contentType := w.Header().Get("Content-Type"); contentType != tt.expectedType {
				t.Errorf("expected content type %s, got %s", tt.expectedType, contentType)
			}

			// Validate response structure
			var response struct {
				Uptime         string    `json:"Uptime"`
				LastCommitHash string    `json:"LastCommitHash"`
				LastCommitTime time.Time `json:"LastCommitTime"`
				DirtyBuild     bool      `json:"DirtyBuild"`
			}

			if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
				t.Fatalf("failed to parse JSON response: %v", err)
			}

			if response.Uptime == "" {
				t.Error("uptime should not be empty")
			}

			if _, err := time.ParseDuration(response.Uptime); err != nil {
				t.Errorf("invalid uptime format: %s", response.Uptime)
			}
		})
	}
}

func TestGetHealth_UptimeIncreases(t *testing.T) {
	handler := GetHealth()

	// First request
	w1 := makeRequest(handler)
	var response1 struct {
		Uptime string `json:"Uptime"`
	}
	if err := json.Unmarshal(w1.Body.Bytes(), &response1); err != nil {
		t.Fatalf("failed to parse JSON response: %v", err)
	}

	// Wait and make second request
	time.Sleep(10 * time.Millisecond)
	w2 := makeRequest(handler)
	var response2 struct {
		Uptime string `json:"Uptime"`
	}
	if err := json.Unmarshal(w2.Body.Bytes(), &response2); err != nil {
		t.Fatalf("failed to parse JSON response: %v", err)
	}

	// Verify uptime increased
	uptime1, _ := time.ParseDuration(response1.Uptime)
	uptime2, _ := time.ParseDuration(response2.Uptime)

	if uptime2 <= uptime1 {
		t.Errorf("expected uptime to increase: %v -> %v", uptime1, uptime2)
	}
}

// Reusable helper function for making HTTP requests
func makeRequest(handler http.HandlerFunc) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	w := httptest.NewRecorder()
	handler(w, req)
	return w
}
