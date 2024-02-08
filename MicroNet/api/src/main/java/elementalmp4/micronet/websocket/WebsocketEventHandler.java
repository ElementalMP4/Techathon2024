package main.java.elementalmp4.micronet.websocket;

import main.java.elementalmp4.micronet.entity.Session;
import main.java.elementalmp4.micronet.service.MessageHandlerService;
import main.java.elementalmp4.micronet.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

@Component
public class WebsocketEventHandler extends AbstractWebSocketHandler {

    @Autowired
    private MessageHandlerService messageHandlerService;

    @Autowired
    private SessionService sessionService;

    @Override
    public void handleTextMessage(WebSocketSession socketSession, TextMessage message) {
        Session session = sessionService.getSession(socketSession.getId());
        messageHandlerService.handleMessage(session, message);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessionService.putSession(session.getId(), new Session(session));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessionService.removeSession(session.getId());
    }

}
