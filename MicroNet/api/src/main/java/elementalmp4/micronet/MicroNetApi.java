package main.java.elementalmp4.micronet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Properties;

@SpringBootApplication
public class MicroNetApi {

    public static void main(final String[] args) {
        String port = System.getenv("MICRONET_API_PORT");
        port = port == null ? "3000" : port;

        Properties properties = new Properties();
        properties.put("server.port", port);

        SpringApplication app = new SpringApplication(MicroNetApi.class);
        app.setDefaultProperties(properties);
        app.run(args);
    }
}