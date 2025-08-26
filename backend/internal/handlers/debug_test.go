package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetDebug(t *testing.T) {
	tests := []struct {
		name           string
		path           string
		expectedStatus int
	}{
		{
			name:           "pprof index",
			path:           "/debug/pprof/",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "pprof cmdline",
			path:           "/debug/pprof/cmdline",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "pprof profile",
			path:           "/debug/pprof/profile?seconds=1",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "pprof symbol",
			path:           "/debug/pprof/symbol",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "pprof trace",
			path:           "/debug/pprof/trace",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "expvar",
			path:           "/debug/vars",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "unknown route",
			path:           "/debug/unknown",
			expectedStatus: http.StatusNotFound,
		},
	}

	handler := GetDebug()

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, tt.path, nil)
			w := httptest.NewRecorder()

			handler.ServeHTTP(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("expected status %d, got %d", tt.expectedStatus, w.Code)
			}
		})
	}
}
