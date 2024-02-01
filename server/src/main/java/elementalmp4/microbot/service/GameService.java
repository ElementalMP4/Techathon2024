package main.java.elementalmp4.microbot.service;

import main.java.elementalmp4.microbot.entity.GameOfLife;
import main.java.elementalmp4.microbot.entity.GameTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Timer;

@Service
public class GameService {

    private Timer gameTimer;

    private int width;
    private int height;

    @Autowired
    private SessionService sessionService;

    public void startGame(int[][] initialGrid) {
        GameOfLife game = new GameOfLife(width, height, initialGrid);
        gameTimer = new Timer("game-timer");
        gameTimer.scheduleAtFixedRate(new GameTask(game, sessionService), 1200, 1200);
    }

    public void stopGame() {
        gameTimer.cancel();
    }

    public void setLayout(int width, int height) {
        this.width = width;
        this.height = height;
    }
}
