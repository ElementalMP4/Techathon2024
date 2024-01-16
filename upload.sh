SERVER_SSH_ADDRESS="wyse"
SERVER_REMOTE_USER="elementalmp4"

rsync -av -e ssh --exclude='node_modules' --exclude='.git' . ${SERVER_REMOTE_USER}@${SERVER_SSH_ADDRESS}:/home/${SERVER_REMOTE_USER}/Techathon2024