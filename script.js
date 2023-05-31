const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

let score = 0;
let cellSize = 5;

const numRows = canvas.height / cellSize;
const numCols = canvas.width / cellSize;

let playerCellSize = 10;
let player = {
    row: 100,
    col: 100
};
let playerRightVelocity = 0;
let playerDownVelocity = 0;

let debug = false;
let gridLines = false;
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

function clearGrid() {
    for (let i = 0; i < numRows; i++) {
        grid[i].fill(0);
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

    if (row + 10 >= numRows) row = numRows - 10;
    if (col + 10 >= numCols) col = numCols - 10;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            grid[row + i][col + j] = Math.random() > .5 ? 1 : 0;
        }
    }
}

//If q is pressed, spawn 10x10 random cells
document.addEventListener('keydown', function (event) {
    if (event.key === 'q') spawn10X10Cells()
});

//If y is pressed, spawn still life
document.addEventListener('keydown', function (event) {
    if (event.key === 'y') {
        spawnStillLife();
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

function clearScore() {
    score = 0;
}


let gameState = 0;
let introOnce = false;
let objective1Once = false;
let objective2Once = false;
let endCreditsOnce = false;
function intro() {
    //Display intro text "Game of Life" centered on screen
    drawGrid();
    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game of Life', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px sans-serif';
    ctx.fillText('Press Enter to start', canvas.width / 2, canvas.height / 2 + 50);

    updateGrid();
    if (!introOnce) {
        //If enter is pressed, start the game
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                gameState = 1;
            }
        }
        );
    }
    introOnce = true;
    endCreditsOnce = false;
}

function objective1() {
    //Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Level 1', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px sans-serif';
    ctx.fillText('Objective: Eat 250 cells', canvas.width / 2, canvas.height / 2 + 50);

    if (!objective1Once) {
        //If enter is pressed, start the game
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                gameState = 2;
                document.removeEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        gameState = 2;
                    }
                }
                );
            }
        });
        setTimeout(function () { gameState = 2; }, 3000);
        objective1Once = true;
        introOnce = false;
    }
}


function level1() {
    if (!paused) {
        updateGrid();
        detectCollisions();

        draw();
        updateKeys();
        updatePlayer();
        if (countCells() < 20) spawn10X10Cells();
    }
    if (score >= 250) {
        gameState = 3;
        clearScore();
    }
}

function objective2() {
    //Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Congratulate the player
    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Level 2', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px sans-serif';
    ctx.fillText('Objective: Score 400', canvas.width / 2, canvas.height / 2 + 50);

    if (!objective2Once) {
        //If enter is pressed, start the game
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                gameState = 4;
                document.removeEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        gameState = 4;
                    }
                }
                );
            }
        });
        setTimeout(function () { gameState = 4; }, 3000);
        objective2Once = true;
        objective1Once = false;
    }
}

function level2() {

    if (!paused) {
        updateGrid();
        detectCollisions();

        draw();
        updateKeys();
        updatePlayer();
        if (countCells() < 20) spawn10X10Cells();
    }

    if (score >= 400) {
        gameState = 5;
        clearScore();
    }

}

function endCredits() {
    //Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Congratulate the player then clear the screen
    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Congratulations!', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px sans-serif';
    ctx.fillText('You have completed the game', canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText('Press Enter to play again', canvas.width / 2, canvas.height / 2 + 100);

    if (!endCreditsOnce) {
        //If enter is pressed, start the game
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                gameState = 0;
                document.removeEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        gameState = 0;
                    }
                });
            }
        });
        playerCellSize = 10;
        endCreditsOnce = true;
        objective2Once = false;
    }
}

//If n is pressed, go to the next scene
document.addEventListener('keydown', function (event) {
    if (event.key === 'n' ) {
        gameState = (gameState + 1) % sceneArray.length;
    }
});


let sceneArray = [
    intro,
    objective1,
    level1,
    objective2,
    level2,
    endCredits
];

clearGrid();
function gameLoop() {
    sceneArray[gameState]();
    requestAnimationFrame(gameLoop);
}

setInterval(function () {
    if (!paused) spawnStillLife();
}, 1000);

gameLoop();