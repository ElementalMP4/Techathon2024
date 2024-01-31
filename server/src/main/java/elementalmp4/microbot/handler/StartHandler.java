package main.java.elementalmp4.microbot.handler;

import main.java.elementalmp4.microbot.entity.GameOfLife;
import main.java.elementalmp4.microbot.entity.Session;
import main.java.elementalmp4.microbot.service.GameService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

@Handler
public class StartHandler extends AbstractHandler {

    @Autowired
    private GameService gameService;

    @Override
    public void execute(Session session, JSONObject data) {
        gameService.startGame(new GameOfLife(2, 2, null));
    }

    @Override
    public String name() {
        return "start";
    }
}
