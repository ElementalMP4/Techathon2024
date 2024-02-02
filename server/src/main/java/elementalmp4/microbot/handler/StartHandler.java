package main.java.elementalmp4.microbot.handler;

import main.java.elementalmp4.microbot.entity.Session;
import main.java.elementalmp4.microbot.service.GameService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import static main.java.elementalmp4.microbot.entity.MessageBuilder.error;
import static main.java.elementalmp4.microbot.entity.MessageBuilder.success;

@Handler
public class StartHandler extends AbstractHandler {

    @Autowired
    private GameService gameService;

    @Override
    public void execute(Session session, JSONObject data) {
        boolean gameStarted = gameService.startGame(null);
        if (gameStarted) session.send(success(name(), "Started new game"));
        else session.send(error(name(), "Display parameters not received from command node, game will not start"));
    }

    @Override
    public String name() {
        return "start";
    }
}
