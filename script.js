const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

//resize canvas
canvas.width = 600;
canvas.height = 600;

let cellSize = 5;
let playerCellSize = 5;
let score = 0;

const numRows = canvas.height / cellSize;
const numCols = canvas.width / cellSize;

let paused = false;

let grid = createGrid(numRows, numCols);

function createGrid(numRows, numCols) {
    let grid = new Array(numRows);
    for (let i = 0; i < numRows; i++) {
        grid[i] = new Array(numCols);
        for (let j = 0; j < numCols; j++) {
            grid[i][j] = Math.floor(Math.random() * 2);
        }
    }
    return grid;
}

//Draw

function drawGrid() {
    ctx.fillStyle = 'blue';
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (grid[i][j] === 1) {
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            } else {
                ctx.clearRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }
}
function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.col * cellSize, player.row * cellSize, playerCellSize, playerCellSize);
    //ctx.fillStyle = 'blue'; // set fill style back to black for other cells
}

//Draw score
function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 8, 20);
}

function updateGrid() {
    let newGrid = createGrid(numRows, numCols);
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let neighbors = countNeighbors(i, j);
            if (grid[i][j] === 1) {
                if (neighbors < 2 || neighbors > 3) {
                    newGrid[i][j] = 0;
                } else {
                    newGrid[i][j] = 1;
                }
            } else {
                if (neighbors === 3) {
                    newGrid[i][j] = 1;
                } else {
                    newGrid[i][j] = 0;
                }
            }
        }
    }
    grid = newGrid;
}

function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let r = row + i;
            let c = col + j;
            if (r >= 0 && r < numRows && c >= 0 && c < numCols && !(i === 0 && j === 0)) {
                count += grid[r][c];
            }
        }
    }
    return count;
}

let player = {
    row: 0,
    col: 0
};


document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp') {
        player.row--;
    } else if (event.key === 'ArrowDown') {
        player.row++;
    } else if (event.key === 'ArrowLeft') {
        player.col--;
    } else if (event.key === 'ArrowRight') {
        player.col++;
    }
});

function detectCollisions() {
    // Calculate the player's bounding box
    const playerTop = player.row * cellSize;
    const playerBottom = playerTop + playerCellSize - 1;
    const playerLeft = player.col * cellSize;
    const playerRight = playerLeft + playerCellSize - 1;

    // Check for collisions with all cells that the player overlaps with
    for (let row = Math.max(0, Math.floor(playerTop / cellSize)); row <= Math.floor(playerBottom / cellSize); row++) {
        for (let col = Math.floor(playerLeft / cellSize); col <= Math.floor(playerRight / cellSize); col++) {
            if (grid[row][col] === 1) {
                grid[row][col] = 0;
                score++;
                if (score % 10 === 0) {
                    increasePlayerSize();
                }
            }
        }
    }

    // Keep the player within the canvas bounds
    if (player.row < 0) {
        player.row = 0;
    } else if (player.row + playerCellSize > canvas.height) {
        player.row = canvas.height - playerCellSize;
    } else if (player.col < 0) {
        player.col = 0;
    } else if (player.col + playerCellSize > numCols * cellSize) {
        player.col = numCols * cellSize - playerCellSize;
    }
}



//Spawn 4 random cells
function spawnCells() {
    for (let i = 0; i < 4; i++) {
        let row = Math.floor(Math.random() * numRows);
        let col = Math.floor(Math.random() * numCols);
        
        //if cell is already alive, try again
        if (grid[row][col] === 1) {
            i--;
        } else {
            grid[row][col] = 1;
        }
    }
}

//If enter is pressed, reset the game
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        score = 0;
        grid = createGrid(numRows, numCols);
    }
});

//If spacebar is pressed, increase player size
document.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
        increasePlayerSize();
    }
});

//Press p to pause and unpause
document.addEventListener('keydown', function (event) {
    if (event.key === 'p') {
        if (paused) {
            paused = false;
        } else {
            paused = true;
        }
    }
});

function increasePlayerSize() {
    playerCellSize += 5;
}

let frame = 0;
function gameLoop() {
    
    if (!paused) {
        //update the grid every 2 seconds
        //if (frame % 20 === 0) {
            updateGrid();
            //}
            detectCollisions();
            
            //spawnCells();
            frame++;
            drawGrid();
            drawPlayer();
            drawScore();
            
        }
    requestAnimationFrame(gameLoop);
}

gameLoop();