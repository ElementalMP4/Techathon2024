class GameOfLife {
    constructor(width, height, initialGrid) {
        this.chunkWidth = width;
        this.chunkHeight = height;
        this.width = width * 5;
        this.height = height * 5;
        this.board = initialGrid ? this.validateAndUseInitialGrid(initialGrid) : this.initializeRandomBoard();
    }

    initializeRandomBoard() {
        const board = [];
        for (let i = 0; i < this.height; i++) {
            const row = [];
            for (let j = 0; j < this.width; j++) {
                row.push(Math.random() > 0.5 ? 1 : 0);
            }
            board.push(row);
        }
        return board;
    }

    validateAndUseInitialGrid(initialGrid) {
        if (initialGrid.length !== this.height || initialGrid[0].length !== this.width) {
            throw new Error('Provided initial grid size does not match the specified width and height.');
        }
        return initialGrid;
    }

    getFormattedBoard() {
        const result = [];
    
        for (let i = 0; i < this.chunkHeight; i++) {
            for (let j = 0; j < this.chunkWidth; j++) {
                const startRow = i * 5;
                const endRow = startRow + 5;
                const startCol = j * 5;
                const endCol = startCol + 5;
    
                const chunk = [];
    
                for (let row = startRow; row < endRow; row++) {
                    const rowData = this.board[row].slice(startCol, endCol);
                    chunk.push(rowData);
                }
    
                result.push(chunk);
            }
        }
    
        return { width: this.chunkWidth, height: this.chunkHeight, frames: result };
    }

    progress() {
        const newBoard = this.copyBoard();
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const neighbors = this.countNeighbors(i, j);
                if (this.board[i][j] === 1) {
                    if (neighbors < 2 || neighbors > 3) {
                        newBoard[i][j] = 0;
                    }
                } else {
                    if (neighbors === 3) {
                        newBoard[i][j] = 1;
                    }
                }
            }
        }
        this.board = newBoard;
        return this.getFormattedBoard();
    }

    countNeighbors(row, col) {
        let count = 0;
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < this.height && j >= 0 && j < this.width && !(i === row && j === col)) {
                    count += this.board[i][j];
                }
            }
        }
        return count;
    }

    copyBoard() {
        return this.board.map(row => row.slice());
    }
}

module.exports = GameOfLife;
