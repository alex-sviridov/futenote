package handlers

import (
	"net/http"
	"testing"
)

func TestGetOpenAPI(t *testing.T) {
	tests := []struct {
		name           string
		openAPI        []byte
		expectedStatus int
		expectedType   string
		expectedCORS   string
		expectedBody   string
	}{
		{
			name:           "version replacement",
			openAPI:        []byte("openapi: 3.0.0\ninfo:\n  version: 0.0.1\n  title: API"),
			expectedStatus: http.StatusOK,
			expectedType:   "application/yaml",
			expectedCORS:   "*",
			expectedBody:   "openapi: 3.0.0\ninfo:\n  version: 0.0.1\n  title: API",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Arrange
			handler := GetOpenAPI(tt.openAPI)
			w := makeRequest(handler)

			// Assert
			if w.Code != tt.expectedStatus {
				t.Errorf("expected status %d, got %d", tt.expectedStatus, w.Code)
			}

			if contentType := w.Header().Get("Content-Type"); contentType != tt.expectedType {
				t.Errorf("expected content type %s, got %s", tt.expectedType, contentType)
			}

			if cors := w.Header().Get("Access-Control-Allow-Origin"); cors != tt.expectedCORS {
				t.Errorf("expected CORS header %s, got %s", tt.expectedCORS, cors)
			}

			if body := w.Body.String(); body != tt.expectedBody {
				t.Errorf("expected body:\n%s\ngot:\n%s", tt.expectedBody, body)
			}
		})
	}
}
