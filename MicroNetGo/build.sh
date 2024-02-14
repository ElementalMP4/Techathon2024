GOOS=windows GOARCH=amd64 go build -o bin/micronet.exe main.go
GOOS=darwin GOARCH=arm64 go build -o bin/micronet main.go