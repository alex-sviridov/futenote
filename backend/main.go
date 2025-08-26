package main

import (
	"context"
	_ "embed"
	"fmt"
	"os"

	"github.com/alex-sviridov/futenote/internal/server"
)

func main() {
	if err := server.Run(context.Background(), os.Stdout, os.Args, getEmbedded()); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
		os.Exit(1)
	}
}

// openAPI holds the embedded OpenAPI YAML file
//
//go:embed api/openapi.yaml
var openAPI []byte

func getEmbedded() map[string][]byte {

	var Embedded = map[string][]byte{
		"openAPI": openAPI,
	}
	return Embedded
}
