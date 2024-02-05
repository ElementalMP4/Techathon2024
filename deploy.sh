cd /home/elementalmp4/Techathon2024
mvn clean package -f server/pom.xml
sudo systemctl restart techathon-api-server techathon-serial-bridge