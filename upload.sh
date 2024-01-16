SERVER_SSH_ADDRESS="wyse"

rsync -av -e ssh --exclude='node_modules' --exclude='.git' . elementalmp4@${SERVER_SSH_ADDRESS}:/home/elementalmp4/Techathon2024