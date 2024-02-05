package main.java.elementalmp4.microbot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Properties;

@SpringBootApplication
public class MicroBotServer {

    public static void main(final String[] args) {
        String port = System.getenv("MICROBOT_API_PORT");
        port = port == null ? "3000" : port;

        Properties properties = new Properties();
        properties.put("server.port", port);

        SpringApplication app = new SpringApplication(MicroBotServer.class);
        app.setDefaultProperties(properties);
        app.run(args);
    }
}