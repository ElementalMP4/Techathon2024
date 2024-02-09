cd /home/elementalmp4/MicroNet
mvn clean package -f api/pom.xml
sudo systemctl restart micronet-api micronet-bridge