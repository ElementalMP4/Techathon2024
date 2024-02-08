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
    private GameOfLife game;

    private int width = 0;
    private int height = 0;

    @Autowired
    private SessionService sessionService;

    public Optional<String> startGame(int[][] initialGrid, int period) {
        if (width == 0 || height == 0) return Optional.of("Display parameters not received from command node, game will not start");
        if (gameTimer.isPresent()) return Optional.of("A game is already in progress");
        game = new GameOfLife(width, height, initialGrid);
        gameTimer = Optional.of(new Timer("game-timer"));
        gameTimer.get().scheduleAtFixedRate(new GameTask(game, sessionService), period, period);
        return Optional.empty();
    }

    public int getCurrentIteration() {
        return gameTimer.isPresent() ? game.getIteration() : 0;
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
                .put("currentIteration", getCurrentIteration())
                .put("gameRunning", gameTimer.isPresent());
    }
}
