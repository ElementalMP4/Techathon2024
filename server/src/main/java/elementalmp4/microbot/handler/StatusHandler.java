package main.java.elementalmp4.microbot.handler;

import main.java.elementalmp4.microbot.entity.Session;
import main.java.elementalmp4.microbot.service.GameService;
import main.java.elementalmp4.microbot.service.SessionService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import static main.java.elementalmp4.microbot.entity.MessageBuilder.error;
import static main.java.elementalmp4.microbot.entity.MessageBuilder.success;

@Handler
public class StatusHandler extends AbstractHandler {

    @Autowired
    private GameService gameService;

    @Autowired
    private SessionService sessionService;

    @Override
    public void execute(Session session, JSONObject data) {
        if (!sessionService.commandNodeConnected()) {
            session.send(error(name(), "Command node not connected"));
        } else {
            session.send(success(name(), gameService.getGameStatus()));
        }
    }

    @Override
    public String name() {
        return "status";
    }
}
