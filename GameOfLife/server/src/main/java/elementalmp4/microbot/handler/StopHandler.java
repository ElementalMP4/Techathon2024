package main.java.elementalmp4.microbot.handler;

import main.java.elementalmp4.microbot.entity.Session;
import main.java.elementalmp4.microbot.service.GameService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import static main.java.elementalmp4.microbot.entity.MessageBuilder.error;
import static main.java.elementalmp4.microbot.entity.MessageBuilder.success;

@Handler
public class StopHandler extends AbstractHandler {

    @Autowired
    private GameService gameService;

    @Override
    public void execute(Session session, JSONObject data) {
        boolean stopped = gameService.stopGame();
        if (stopped) {
            session.send(success(name(), "Stopped current game"));
        } else {
            session.send(error(name(), "No game currently started"));
        }
    }

    @Override
    public String name() {
        return "stop";
    }
}
