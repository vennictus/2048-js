let board = [];        // 2D array → holds the 4x4 grid numbers
let score = 0;         // current score
const rows = 4;        // number of rows in the board
const columns = 4;     // number of columns in the board

// start the game as soon as everything loads
window.onload = function() {
    setGame();
}

// ----------------------------------------------
// SETUP + RESET
// ----------------------------------------------
function setGame() {
    // clear out old board div (important on reset)
    document.getElementById("board").innerHTML = "";

    // reset score + HUD
    score = 0;
    updateScore();

    // empty 4x4 array (all zeros means blank tiles)
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // build the grid visually in DOM
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c; // unique id like "0-2"
            updateTile(tile, board[r][c]);
            document.getElementById("board").append(tile);
        }
    }

    // every new game starts with 2 random "2" tiles
    setTwo();
    setTwo();

    // sync HUD (score + moves + gameover banner)
    syncHUD();
}

// click → start fresh
document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("gameOver").style.display = "none";
    setGame();
});

// ----------------------------------------------
// TILE HANDLING
// ----------------------------------------------
function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num);
        } else {
            tile.classList.add("x9182"); // all big bois same color
        }
    }
}

// ----------------------------------------------
// CONTROLS
// ----------------------------------------------
document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft") slideLeft();
    else if (e.code === "ArrowRight") slideRight();
    else if (e.code === "ArrowUp") slideUp();
    else if (e.code === "ArrowDown") slideDown();
});

// ----------------------------------------------
// SLIDE LOGIC
// ----------------------------------------------

// removes zeros
function filterZero(row) {
    return row.filter(num => num != 0);
}

// slide + merge a single row (to the left)
function slide(row) {
    row = filterZero(row);

    // merge step
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);

    // pad with zeros back to length 4
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

// slide entire board left
function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = slide(board[r]);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }
    }
    afterMove();
}

// slide right
function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r].slice().reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }
    }
    afterMove();
}

// slide up
function slideUp() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        col = slide(col);
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }
    }
    afterMove();
}

// slide down
function slideDown() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse();
        col = slide(col);
        col.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }
    }
    afterMove();
}

// what happens after every move
function afterMove() {
    setTwo();       // drop a new random "2"
    syncHUD();      // update score, moves, and game over state
}

// ----------------------------------------------
// RANDOM TILE
// ----------------------------------------------
function setTwo() {
    if (!hasEmptyTile()) return;

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] === 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r + "-" + c);
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) return true;
        }
    }
    return false;
}

// ----------------------------------------------
// HUD: SCORE, MOVES, GAME OVER
// ----------------------------------------------
function updateScore() {
    document.getElementById("score").innerText = score;
}

// check if you can move in each direction
function canMoveLeft(b = board) {
    for (let r = 0; r < rows; r++) {
        for (let c = 1; c < columns; c++) {
            if (b[r][c] === 0) continue;
            if (b[r][c - 1] === 0 || b[r][c - 1] === b[r][c]) return true;
        }
    }
    return false;
}
function canMoveRight(b = board) {
    for (let r = 0; r < rows; r++) {
        for (let c = columns - 2; c >= 0; c--) {
            if (b[r][c] === 0) continue;
            if (b[r][c + 1] === 0 || b[r][c + 1] === b[r][c]) return true;
        }
    }
    return false;
}
function canMoveUp(b = board) {
    for (let c = 0; c < columns; c++) {
        for (let r = 1; r < rows; r++) {
            if (b[r][c] === 0) continue;
            if (b[r - 1][c] === 0 || b[r - 1][c] === b[r][c]) return true;
        }
    }
    return false;
}
function canMoveDown(b = board) {
    for (let c = 0; c < columns; c++) {
        for (let r = rows - 2; r >= 0; r--) {
            if (b[r][c] === 0) continue;
            if (b[r + 1][c] === 0 || b[r + 1][c] === b[r][c]) return true;
        }
    }
    return false;
}

// count directions (0–4) instead of “empty tiles”
function countPossibleMoves() {
    let cnt = 0;
    if (canMoveLeft()) cnt++;
    if (canMoveRight()) cnt++;
    if (canMoveUp()) cnt++;
    if (canMoveDown()) cnt++;
    return cnt;
}

// refresh the bottom HUD
function syncHUD() {
    updateScore();
    let moves = countPossibleMoves();
    document.getElementById("moves").innerText = moves;

    // game over banner toggle
    const go = document.getElementById("gameOver");
    if (go) go.style.display = (moves === 0) ? "block" : "none";
}
