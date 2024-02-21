echo "Compiling for Windows"
GOOS=windows GOARCH=amd64 go build -o bin/micronet.exe
echo "Compiling for MacOS"
GOOS=darwin GOARCH=arm64 go build -o bin/micronet