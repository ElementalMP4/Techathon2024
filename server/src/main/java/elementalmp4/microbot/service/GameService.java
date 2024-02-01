package main.java.elementalmp4.microbot.service;

import main.java.elementalmp4.microbot.entity.GameOfLife;
import main.java.elementalmp4.microbot.entity.GameTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Timer;

@Service
public class GameService {

    private Timer gameTimer;

    @Autowired
    private SessionService sessionService;

    public void startGame(GameOfLife game) {
        gameTimer = new Timer("game-timer");
        gameTimer.scheduleAtFixedRate(new GameTask(game, sessionService), 500, 500);
    }

    public void stopGame() {
        gameTimer.cancel();
    }
}
