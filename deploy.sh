SERVER_SSH_ADDRESS="192.168.10.2"
SERVER_REMOTE_USER="elementalmp4"

rsync -av -e ssh --exclude='node_modules' --exclude='.git' --exclude 'target' . ${SERVER_REMOTE_USER}@${SERVER_SSH_ADDRESS}:/home/${SERVER_REMOTE_USER}/Techathon2024

mvn clean package -f server/pom.xml
scp server/target/original-MicroBot-0.0.1.jar ${SERVER_REMOTE_USER}@${SERVER_SSH_ADDRESS}:/home/${SERVER_REMOTE_USER}/Techathon2024/server/server.jar

ssh -t ${SERVER_REMOTE_USER}@${SERVER_SSH_ADDRESS} sudo systemctl restart techathon-api-server techathon-serial-bridge