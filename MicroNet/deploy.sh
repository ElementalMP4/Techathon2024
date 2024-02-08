cd /home/elementalmp4/MicroNet
mvn clean package -f server/pom.xml
sudo systemctl restart micronet-api micronet-bridge