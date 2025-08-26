TARGET_EXEC := ./bin/app
PORT := 8080


default: clean build lint test 

download:
	go mod download

build: download
	go build -o $(TARGET_EXEC) . 

test:
	go test -shuffle=on -race -coverprofile=coverage.txt ./...

lint: download
	golangci-lint run

run: build
	./$(TARGET_EXEC) --port=$(PORT)

clean:
	rm -rf coverage.txt $(TARGET_EXEC) 
