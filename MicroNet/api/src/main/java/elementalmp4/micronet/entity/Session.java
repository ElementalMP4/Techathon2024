package main.java.elementalmp4.micronet.entity;

import org.json.JSONObject;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Optional;

public class Session {

    private String sessionType;
    private String sessionGroup;
    private final WebSocketSession socket;

    public Session(WebSocketSession socket) {
        this.sessionType = "client";
        this.socket = socket;
    }

    public void send(JSONObject message) {
        try {
            this.socket.sendMessage(new TextMessage(message.toString()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void setSessionType(String sessionType) {
        this.sessionType = sessionType;
    }

    public Optional<String> getSessionType() {
        return Optional.ofNullable(this.sessionType);
    }

    public String getSessionId() {
        return this.socket.getId();
    }

    public Optional<String> getSessionGroup() {
        return Optional.ofNullable(this.sessionGroup);
    }

    public void setSessionGroup(String sessionGroup) {
        this.sessionGroup = sessionGroup;
    }

}
