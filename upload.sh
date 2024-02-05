SERVER_SSH_ADDRESS="192.168.10.2"
SERVER_REMOTE_USER="elementalmp4"

rsync -av -e ssh --exclude='node_modules' --exclude='.git' --exclude 'target' . ${SERVER_REMOTE_USER}@${SERVER_SSH_ADDRESS}:/home/${SERVER_REMOTE_USER}/Techathon2024

ssh -t ${SERVER_REMOTE_USER}@${SERVER_SSH_ADDRESS} /bin/bash /home/elementalmp4/Techathon2024/deploy.sh