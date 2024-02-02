package main.java.elementalmp4.microbot.service;

import main.java.elementalmp4.microbot.entity.GameOfLife;
import main.java.elementalmp4.microbot.entity.GameTask;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Timer;

@Service
public class GameService {

    private Optional<Timer> gameTimer = Optional.empty();

    private int width = 0;
    private int height = 0;

    @Autowired
    private SessionService sessionService;

    public boolean startGame(int[][] initialGrid) {
        if (width == 0 || height == 0) return false;
        GameOfLife game = new GameOfLife(width, height, initialGrid);
        gameTimer = Optional.of(new Timer("game-timer"));
        gameTimer.get().scheduleAtFixedRate(new GameTask(game, sessionService), 1200, 1200);
        return true;
    }

    public boolean stopGame() {
        if (gameTimer.isPresent()) {
            gameTimer.get().cancel();
            gameTimer = Optional.empty();
            return true;
        } else {
            return false;
        }
    }

    public void setLayout(int width, int height) {
        this.width = width;
        this.height = height;
    }

    public JSONObject getGameStatus() {
        return new JSONObject()
                .put("microbitCount", width * height)
                .put("displayWidth", width)
                .put("displayHeight", height)
                .put("gameRunning", gameTimer.isPresent());
    }
}
