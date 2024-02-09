package main.java.elementalmp4.micronet.service;

import main.java.elementalmp4.micronet.entity.Session;
import main.java.elementalmp4.micronet.exception.HandlerNotFoundException;
import main.java.elementalmp4.micronet.handler.AbstractHandler;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import static main.java.elementalmp4.micronet.entity.MessageBuilder.error;

@Service
public class MessageHandlerService {

    private static final Logger LOGGER = Logger.getLogger(MessageHandlerService.class.getName());

    @Autowired
    private List<AbstractHandler> handlers;

    public void handleMessage(Session session, TextMessage message) {
        try {
            JSONObject json = new JSONObject(message.getPayload());
            String handlerType = json.getString("type");
            Optional<AbstractHandler> handler = handlers.stream()
                    .filter(h -> h.name().equals(handlerType))
                    .findFirst();

            if (handler.isEmpty()) {
                throw new HandlerNotFoundException(handlerType);
            }

            LOGGER.info("Received " + json.getString("type") + " from " + session.getSessionId());
            handler.get().execute(session, json.getJSONObject("data"));
        } catch (Exception e) {
            LOGGER.severe("Error when processing websocket message from " + session.getSessionId());
            e.printStackTrace();
            session.send(error("system", e));
        }

    }

}
