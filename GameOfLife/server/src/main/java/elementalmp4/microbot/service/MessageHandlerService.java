package main.java.elementalmp4.microbot.service;

import main.java.elementalmp4.microbot.entity.Session;
import main.java.elementalmp4.microbot.exception.HandlerNotFoundException;
import main.java.elementalmp4.microbot.handler.AbstractHandler;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;

import java.util.List;
import java.util.Optional;

import static main.java.elementalmp4.microbot.entity.MessageBuilder.error;

@Service
public class MessageHandlerService {

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

            handler.get().execute(session, json.getJSONObject("data"));

        } catch (Exception e) {
            e.printStackTrace();
            session.send(error("system", e));
        }

    }

}
