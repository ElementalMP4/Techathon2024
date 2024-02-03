package main.java.elementalmp4.microbot.handler;

import main.java.elementalmp4.microbot.entity.Session;
import main.java.elementalmp4.microbot.service.GameService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static main.java.elementalmp4.microbot.entity.MessageBuilder.error;
import static main.java.elementalmp4.microbot.entity.MessageBuilder.success;

@Handler
public class StartHandler extends AbstractHandler {

    @Autowired
    private GameService gameService;

    @Override
    public void execute(Session session, JSONObject data) {
        int[][] initialGrid = null;
        if (data.has("board")) initialGrid = jsonArrayToJavaArray(data.getJSONArray("board"));
        Optional<String> startError = gameService.startGame(initialGrid);
        if (startError.isEmpty()) session.send(success(name(), "Started new game"));
        else session.send(error(name(), startError.get()));
    }

    private int[][] jsonArrayToJavaArray(JSONArray array) {
        int rows = array.length();
        int columns = array.getJSONArray(0).length();

        int[][] matrix = new int[rows][columns];

        for (int i = 0; i < rows; i++) {
            JSONArray rowArray = array.getJSONArray(i);
            for (int j = 0; j < columns; j++) {
                matrix[i][j] = rowArray.getInt(j);
            }
        }
        return matrix;
    }

    @Override
    public String name() {
        return "start";
    }
}
