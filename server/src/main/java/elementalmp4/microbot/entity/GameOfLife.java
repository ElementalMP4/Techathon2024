package main.java.elementalmp4.microbot.entity;

import org.json.JSONObject;

import java.util.Arrays;

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
        int[][] result = new int[chunkHeight * 5][chunkWidth * 5];

        for (int i = 0; i < chunkHeight; i++) {
            for (int j = 0; j < chunkWidth; j++) {
                int startRow = i * 5;
                int endRow = startRow + 5;
                int startCol = j * 5;
                int endCol = startCol + 5;

                for (int row = startRow; row < endRow; row++) {
                    result[row] = Arrays.copyOfRange(board[row], startCol, endCol);
                }
            }
        }

        return new JSONObject().put("width", chunkWidth).put("height", chunkHeight).put("frames", result);
    }

    public JSONObject progress() {
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
        return getFormattedBoard();
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
