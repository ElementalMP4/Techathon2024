package main.java.elementalmp4.microbot.handler;

import main.java.elementalmp4.microbot.entity.GameOfLife;
import main.java.elementalmp4.microbot.entity.Session;
import main.java.elementalmp4.microbot.service.GameService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import static main.java.elementalmp4.microbot.entity.MessageBuilder.success;

@Handler
public class StartHandler extends AbstractHandler {

    @Autowired
    private GameService gameService;

    @Override
    public void execute(Session session, JSONObject data) {
        gameService.startGame(null);
        session.send(success(name(), "Started new game"));
    }

    @Override
    public String name() {
        return "start";
    }
}
