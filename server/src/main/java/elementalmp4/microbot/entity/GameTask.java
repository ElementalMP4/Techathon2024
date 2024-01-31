package main.java.elementalmp4.microbot.entity;

import main.java.elementalmp4.microbot.service.SessionService;

import java.util.TimerTask;

public class GameTask extends TimerTask {

    private final GameOfLife game;
    private final SessionService sessionService;

    public GameTask(GameOfLife game, SessionService sessionService) {
        this.game = game;
        this.sessionService = sessionService;
    }

    @Override
    public void run() {
        if (sessionService.getCommandNodeSession().isPresent()) {
            sessionService.getCommandNodeSession().get().send(game.progress());
        }
    }
}
