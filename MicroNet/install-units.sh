sudo cp -r lib/* /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable $(ls lib)