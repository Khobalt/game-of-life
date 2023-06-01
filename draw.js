//Draw

function draw(cellColor = 'white', background = 'black') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(cellColor, background);
    drawPlayer();
    drawScore();
    if (debug) {
        drawDebug();
    }
    if (gridLines) {
        drawGridLines();
    }
}

function drawGrid(color = 'white', background = 'black') {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (grid[i][j] === 1) {
                ctx.fillStyle = color;
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            } else {
                ctx.fillStyle = background;
                
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
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
    ctx.textAlign = 'left';
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
