sudo cp -r *.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable $(ls lib)