package main.java.elementalmp4.microbot.handler;

import main.java.elementalmp4.microbot.entity.Session;
import main.java.elementalmp4.microbot.service.SessionService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static main.java.elementalmp4.microbot.entity.MessageBuilder.error;
import static main.java.elementalmp4.microbot.entity.MessageBuilder.success;

@Handler
public class LayoutHandler extends AbstractHandler {

    @Autowired
    private SessionService sessionService;

    @Override
    public void execute(Session session, JSONObject data) {
        Optional<Session> commandNode = sessionService.getCommandNodeSession();
        if (commandNode.isPresent()) {
            commandNode.get().send(success(name(), data));
        } else {
            commandNode.get().send(error(name(), "Command node not found"));
        }
    }

    @Override
    public String name() {
        return "display-layout";
    }
}
