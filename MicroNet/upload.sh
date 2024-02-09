SERVER_SSH_ADDRESS="micronet.local"
SERVER_REMOTE_USER="elementalmp4"

rsync -av -e ssh --exclude='node_modules' --exclude='.git' --exclude 'target' --exclude '.idea' --exclude '.DS_Store' . ${SERVER_REMOTE_USER}@${SERVER_SSH_ADDRESS}:/home/${SERVER_REMOTE_USER}/MicroNet

if [[ "$*" =~ "--deploy" ]]; then
    ssh -t ${SERVER_REMOTE_USER}@${SERVER_SSH_ADDRESS} /bin/bash /home/elementalmp4/MicroNet/lib/deploy.sh
fi

if [[ "$*" =~ "--redeploy" ]]; then
    ssh -t ${SERVER_REMOTE_USER}@${SERVER_SSH_ADDRESS} /bin/bash /home/elementalmp4/MicroNet/lib/redeploy.sh
fi