package main.java.elementalmp4.microbot.entity;

import org.json.JSONObject;

import java.util.Arrays;

import static main.java.elementalmp4.microbot.entity.MessageBuilder.success;

public class GameOfLife {
    private final int chunkWidth;
    private final int chunkHeight;
    private final int width;
    private final int height;
    private int[][] board;

    public GameOfLife(int width, int height, int[][] initialGrid) {
        this.chunkWidth = width;
        this.chunkHeight = height;
        this.width = width * 5;
        this.height = height * 5;
        this.board = initialGrid != null ? validateAndUseInitialGrid(initialGrid) : initializeRandomBoard();
    }

    private int[][] initializeRandomBoard() {
        int[][] board = new int[height][width];
        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                board[i][j] = Math.random() > 0.5 ? 1 : 0;
            }
        }
        return board;
    }

    private int[][] validateAndUseInitialGrid(int[][] initialGrid) {
        if (initialGrid.length != height || initialGrid[0].length != width) {
            throw new IllegalArgumentException("Provided initial grid size does not match the specified width and height.");
        }
        return initialGrid;
    }

    public JSONObject getFormattedBoard() {
        int[][][] result = new int[chunkWidth * chunkHeight][5][5];
        for (int j = 0; j < chunkHeight; j++) {
            for (int i = 0; i < chunkWidth; i++) {
                int startX = i * 5;
                int startY = j * 5;

                for (int x = 0; x < 5; x++) {
                    for (int y = 0; y < 5; y++) {
                        result[j * chunkWidth + i][y][x] = board[startY + y][startX + x];
                    }
                }
            }
        }

        JSONObject gameBoard = new JSONObject().put("width", chunkWidth).put("height", chunkHeight).put("frames", result);
        return success("game-update", gameBoard);
    }

    public JSONObject getBoard() {
        JSONObject gameBoard = new JSONObject().put("width", chunkWidth).put("height", chunkHeight).put("board", board);
        return success("game-update", gameBoard);
    }

    public void progress() {
        int[][] newBoard = copyBoard();
        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                int neighbors = countNeighbors(i, j);
                if (board[i][j] == 1) {
                    if (neighbors < 2 || neighbors > 3) {
                        newBoard[i][j] = 0;
                    }
                } else {
                    if (neighbors == 3) {
                        newBoard[i][j] = 1;
                    }
                }
            }
        }
        board = newBoard;
    }

    private int countNeighbors(int row, int col) {
        int count = 0;
        for (int i = row - 1; i <= row + 1; i++) {
            for (int j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < height && j >= 0 && j < width && !(i == row && j == col)) {
                    count += board[i][j];
                }
            }
        }
        return count;
    }

    private int[][] copyBoard() {
        return Arrays.stream(board).map(int[]::clone).toArray(int[][]::new);
    }
}
