package server

import (
	"bytes"
	"encoding/json"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"
)

// TestAccessLogMiddleware tests accesslog middleware
func TestAccessLogMiddleware(t *testing.T) {
	t.Parallel()

	type record struct {
		Method string `json:"method"`
		Path   string `json:"path"`
		Query  string `json:"query"`
		Status int    `json:"status"`
		body   []byte `json:"-"`
		Bytes  int    `json:"bytes"`
	}

	tests := []record{
		{
			Method: "GET",
			Path:   "/test",
			Query:  "?key=value",
			Status: http.StatusOK,
			body:   []byte(`{"hello":"world"}`),
		},
		{
			Method: "POST",
			Path:   "/api",
			Status: http.StatusCreated,
			body:   []byte(`{"id":1}`),
		},
		{
			Method: "DELETE",
			Path:   "/users/1",
			Status: http.StatusNoContent,
		},
	}

	for _, tt := range tests {
		name := strings.Join([]string{tt.Method, tt.Path, tt.Query, strconv.Itoa(tt.Status)}, " ")
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			var buffer strings.Builder
			handler := accesslog(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
				w.WriteHeader(tt.Status)
				w.Write(tt.body) //nolint:errcheck
			}), slog.New(slog.NewJSONHandler(&buffer, nil)))

			req := httptest.NewRequest(tt.Method, tt.Path+tt.Query, bytes.NewReader(tt.body))
			rec := httptest.NewRecorder()
			handler.ServeHTTP(rec, req)

			var log record
			err := json.NewDecoder(strings.NewReader(buffer.String())).Decode(&log)
			testNil(t, err)

			testEqual(t, tt.Method, log.Method)
			testEqual(t, tt.Path, log.Path)
			testEqual(t, strings.TrimPrefix(tt.Query, "?"), log.Query)
			testEqual(t, len(tt.body), log.Bytes)
			testEqual(t, tt.Status, log.Status)
		})
	}
}

// TestRecoveryMiddleware tests recovery middleware
func TestRecoveryMiddleware(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name      string
		hf        func(w http.ResponseWriter, r *http.Request)
		wantCode  int
		wantPanic bool
	}{
		{
			name: "no panic on normal http.Handler",
			hf: func(w http.ResponseWriter, _ *http.Request) {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("success")) //nolint:errcheck
			},
			wantCode:  http.StatusOK,
			wantPanic: false,
		},
		{
			name: "no panic on http.ErrAbortHandler",
			hf: func(_ http.ResponseWriter, _ *http.Request) {
				panic(http.ErrAbortHandler)
			},
			wantCode:  http.StatusOK,
			wantPanic: false,
		},
		{
			name: "panic on http.Handler",
			hf: func(_ http.ResponseWriter, _ *http.Request) {
				panic("something went wrong")
			},
			wantCode:  http.StatusInternalServerError,
			wantPanic: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			var buffer strings.Builder
			handler := recovery(http.HandlerFunc(tt.hf), slog.New(slog.NewTextHandler(&buffer, nil)))

			req := httptest.NewRequest(http.MethodGet, "/test", nil)
			rec := httptest.NewRecorder()
			handler.ServeHTTP(rec, req)

			testEqual(t, tt.wantCode, rec.Code)
			if tt.wantPanic {
				testContains(t, "panic!", buffer.String())
			}
		})
	}
}

func testEqual[T comparable](tb testing.TB, want, got T) {
	tb.Helper()
	if want != got {
		tb.Fatalf("want: %v; got: %v", want, got)
	}
}

func testNil(tb testing.TB, err error) {
	tb.Helper()
	testEqual(tb, nil, err)
}

func testContains(tb testing.TB, needle string, haystack string) {
	tb.Helper()
	if !strings.Contains(haystack, needle) {
		tb.Fatalf("%q not in %q", needle, haystack)
	}
}
