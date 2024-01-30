package main.java.elementalmp4.microbot.entity;

import org.json.JSONObject;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

public class Session {

    private String sessionType;
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

    public boolean isCommandNode() {
        return this.sessionType.equals("command");
    }

    public String getSessionId() {
        return this.socket.getId();
    }

}
