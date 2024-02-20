echo "Compiling for Windows"
GOOS=windows GOARCH=amd64 go build -o bin/micronet_windows_amd64.exe
echo "Compiling for MacOS"
GOOS=darwin GOARCH=arm64 go build -o bin/micronet_macos_arm
echo "Compiling for Linux ARM"
GOOS=linux GOARCH=arm64 go build -o bin/micronet_linux_arm64
echo "Compiling for Linux x86"
GOOS=linux GOARCH=amd64 go build -o bin/micronet_linux_amd64