const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

//resize canvas
canvas.width = 600;
canvas.height = 600;

let cellSize = 5;
let playerCellSize = 5;
let score = 0;

playerRightVelocity = 0;
playerDownVelocity = 0;

let debug = false;
let gridLines = false;

const numRows = canvas.height / cellSize;
const numCols = canvas.width / cellSize;

let paused = false;

let grid = createGrid(numRows, numCols);
let lastGrid = copyGrid(grid);

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

let player = {
    row: 100,
    col: 100
};

//player.col = Math.floor(Math.random() * numCols);
//player.row = Math.floor(Math.random() * numRows);

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
}

//Draw score
function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 8, 20);
}

function drawGridLines() {

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < numRows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
    for (let j = 0; j < numCols; j++) {
        ctx.beginPath();
        ctx.moveTo(j * cellSize, 0);
        ctx.lineTo(j * cellSize, canvas.height);
        ctx.stroke();
    }

}

function drawDebug() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Player Row: ' + player.row, 8, 40);
    ctx.fillText('Player Col: ' + player.col, 8, 60);

    // The player's bounding box
    ctx.fillStyle = 'green';
    ctx.fillText('Player Top: ' + player.row * cellSize, 8, 80);
    ctx.fillText('Player Bottom: ' + (player.row * cellSize + playerCellSize - 1), 8, 100);
    ctx.fillText('Player Left: ' + player.col * cellSize, 8, 120);
    ctx.fillText('Player Right: ' + (player.col * cellSize + playerCellSize - 1), 8, 140);

    ctx.fillStyle = 'white';
    ctx.fillText('Player Top Cell: ' + Math.max(0, Math.floor(player.row / cellSize)), 8, 160);
    ctx.fillText('Player Bottom Cell: ' + Math.floor((player.row + playerCellSize - 1) / cellSize), 8, 180);
    ctx.fillText('Player Left Cell: ' + Math.floor(player.col / cellSize), 8, 200);
    ctx.fillText('Player Right Cell: ' + Math.floor((player.col + playerCellSize - 1) / cellSize), 8, 220);

    ctx.fillText('Total Rows: ' + numRows, 8, 240);
    ctx.fillText('Total Cols: ' + numCols, 8, 260);

    ctx.fillText('Player Cell Size: ' + playerCellSize, 8, 280);
    ctx.fillText('Cell Size: ' + cellSize, 8, 300);


}

function copyGrid(grid) {
    let newGrid = [];
    for (let row = 0; row < numRows; row++) {
        newGrid.push([]);
        for (let col = 0; col < numCols; col++) {
            newGrid[row].push(grid[row][col]);
        }
    }
    return newGrid;
}

function compareGrids(grid1, grid2) {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (grid1[row][col] !== grid2[row][col]) {
                return false;
            }
        }
    }
    return true;
}


function randomProperty(obj) {
    let keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};

function spawnStillLife() {

    let stillLife = randomProperty(stillLifesAndOscillators);
    let startX = Math.floor(Math.random() * (numCols - stillLife[0].length));
    let startY = Math.floor(Math.random() * (numRows - stillLife.length));
    for (let i = 0; i < stillLife.length; i++) {
        for (let j = 0; j < stillLife[0].length; j++) {
            grid[startY + i][startX + j] = stillLife[i][j];
        }
    }
}

function updateGrid() {
    lastGrid = copyGrid(grid);
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

    if (compareGrids(grid, lastGrid)) {
        spawn10X10Cells();
    }
}

function updatePlayer() {
    player.col += playerRightVelocity;
    player.row += playerDownVelocity;
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



let keys = {};

document.addEventListener('keydown', function (event) {
    keys[event.code] = true;
});

document.addEventListener('keyup', function (event) {
    keys[event.code] = false;
});

function updateKeys() {
    if (keys['ArrowUp'] || keys['KeyI'] || keys['ArrowDown'] || keys['KeyK']) {
        if (keys['ArrowUp'] || keys['KeyI']) { // up arrow or 'i' key
            playerDownVelocity -= .05;
        } if (keys['ArrowDown'] || keys['KeyK']) { // down arrow or 'k' key
            playerDownVelocity += .05;
        }
    } else playerDownVelocity *= .9;
    if (keys['ArrowLeft'] || keys['KeyJ'] || keys['ArrowRight'] || keys['KeyL']) {
        if (keys['ArrowLeft'] || keys['KeyJ']) { // left arrow or 'j' key
            playerRightVelocity -= .05;
        }
        if (keys['ArrowRight'] || keys['KeyL']) { // right arrow or 'l' key
            playerRightVelocity += .05;
        }
    } else playerRightVelocity *= .9;
}

// turn on and off debug mode
document.addEventListener('keydown', function (event) {
    if (event.key === 'd') {
        debug = !debug;
    }
});

// turn on and off grid lines
document.addEventListener('keydown', function (event) {
    if (event.key === 'g') {
        gridLines = !gridLines;
    }
});

function detectCollisions() {
    // Calculate the player's bounding box
    const playerTop = player.row * cellSize;
    const playerBottom = playerTop + playerCellSize - 1;
    const playerLeft = player.col * cellSize;
    const playerRight = playerLeft + playerCellSize - 1;


    // Keep the player within the canvas bounds
    if (player.row < 0) {
        player.row = 0;
    } else if (player.row + playerCellSize / cellSize >= numRows) {
        player.row = numRows - playerCellSize / cellSize;
        if (player.col + playerCellSize / cellSize >= numCols) {
            player.col = numCols - playerCellSize / cellSize;
        }
    } else if (player.col < 0) {
        player.col = 0;
    } else if (player.col + playerCellSize / cellSize >= numCols) {
        player.col = numCols - playerCellSize / cellSize;
    }

    // Check for collisions with all cells that the player overlaps with
    for (let row = Math.max(0, Math.floor(playerTop / cellSize)); row <= Math.floor(playerBottom / cellSize); row++) {
        for (let col = Math.floor(playerLeft / cellSize); col <= Math.floor(playerRight / cellSize); col++) {
            if (grid[row]) {
                if (grid[row][col] === 1) {
                    grid[row][col] = 0;
                    score++;
                    if (score % 100 === 0) {
                        increasePlayerSize();
                    }
                }
            }
        }
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

function spawn10X10Cells() {

    let row = Math.floor(Math.random() * numRows);
    let col = Math.floor(Math.random() * numCols);

    if (row + 10 >= numRows) {
        row = numRows - 10;
    }
    if (col + 10 >= numCols) {
        col = numCols - 10;
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            grid[row + i][col + j] = Math.random() > .5 ? 1 : 0;
        }
    }
}

//If q is pressed, spawn 10x10 random cells
document.addEventListener('keydown', function (event) {
    if (event.key === 'q') {
        spawn10X10Cells();
    }
});

//If y is pressed, spawn still life
document.addEventListener('keydown', function (event) {
    if (event.key === 'y') {
        spawnStillLife();
    }
});

//If enter is pressed, reset the game
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        score = 0;
        grid = createGrid(numRows, numCols);
        player.row = Math.floor(numRows / 2);
        player.col = Math.floor(numCols / 2);
        playerCellSize = cellSize;

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

function countCells() {
    let count = 0;
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (grid[row][col] === 1) {
                count++;
            }
        }
    }
    return count;
}

function increasePlayerSize() {
    playerCellSize += 5;
}



function gameLoop() {

    if (!paused) {
        updateGrid();
        detectCollisions();

        //spawnCells();
        drawGrid();
        updateKeys();
        updatePlayer();
        drawPlayer();
        drawScore();
        if (countCells() < 20) {
            spawn10X10Cells();
        }
        if (gridLines) drawGridLines();
        if (debug) drawDebug();

    }
    requestAnimationFrame(gameLoop);
}

setInterval(function () {
    if (!paused) {
        spawnStillLife();
    }
}, 1000);

gameLoop();