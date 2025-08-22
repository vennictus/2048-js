let board = []; // holds the actual grid (4x4 matrix)
let score = 0; // keeps track of total score
const rows = 4; // number of rows in the grid
const columns = 4; // number of columns in the grid

// game starts as soon as the window loads
window.onload = function(){
    setGame();
}

function setGame(){
    // initialise the board with all zeros (so basically it's empty)
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    // debugging layout (for testing merges etc.)
    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ];

    // loop through every single square in the grid
    for ( let r = 0; r < rows; r++){
        for (let c = 0; c < columns; c++){

            // create an empty div for each square
            let tile = document.createElement("div");

            // give each tile a unique id based on row and column → e.g. "2-3"
            tile.id = r.toString() + "-" + c.toString();

            // grab whatever number is at this spot in the board
            let num = board[r][c];
            
            // style the tile based on that number (blank if 0, otherwise a value tile)
            updateTile(tile, num);

            // actually put this div into the "board" container in the HTML
            document.getElementById("board").append(tile);
        }
    }

    // game should never start completely empty → add two starting "2"s
    setTwo();
    setTwo();
}

// handles how a tile should look based on its number
function updateTile(tile, num){
    tile.innerText = "";        // clear whatever was in the tile before
    tile.classList.value = "";  // reset all old classes
    tile.classList.add("tile"); // give it the basic "tile" styling

    // only bother showing something if num > 0
    if (num > 0){
        tile.innerText = num; // put the number inside the square

        // use specific CSS classes for specific values (x2, x4, x8 etc.)
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        }
        else {
            // anything bigger than 4096 gets lumped into one style (x9182)
            tile.classList.add("x9182");
        }
    }
}

// listen for arrow key presses → move tiles accordingly
document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft"){
        slideLeft();
    }
    else if (e.code == "ArrowRight"){
        slideRight();
    }
    else if (e.code == "ArrowUp"){
        slideUp();
    }
    else if (e.code == "ArrowDown"){
        slideDown();
    }
})

// helper function: strip out zeros from a row
// e.g. [2,0,2,4] → [2,2,4]
function filterZero(row){
    return row.filter(num => num != 0);
}

// main sliding/merging logic for a single row
function slide(row){ 
    row = filterZero(row); // first get rid of all zeros

    // merge step → look at each number and the one next to it
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]){   // if two same numbers touch
            row[i] *= 2;           // double the first one
            row[i + 1] = 0;        // wipe the second one
            score += row[i];       // add that value to score
        }
    }

    // remove the "0" gaps created by merging
    row = filterZero(row);

    // fill the rest with zeros so row always has 4 items
    while(row.length < columns){
        row.push(0);
    }
    return row;
}

// slide everything left
function slideLeft() {
    for (let r = 0; r < rows; r++){
        let row = board[r];
        row = slide(row); // merge + shift left
        board[r] = row;

        // update every tile on that row visually
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
    setTwo();       // spawn new tile
    updateScore();  // refresh score display
}

// slide everything right (just reverse, slide left, reverse back)
function slideRight() {
    for (let r = 0; r < rows; r++){
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
    setTwo();
    updateScore();
}

// slide everything up → treat each column like a "row"
function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r]; // update board with new values
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    setTwo();
    updateScore();
}

// slide everything down → reverse column, slide, reverse back
function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    setTwo();
    updateScore();
}

// randomly place a "2" tile somewhere empty on the board
function setTwo() {
    if (!hasEmptyTile()) {
        return; // do nothing if the board is full
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) { // found an empty spot
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

// checks if at least one tile is empty (used before spawning new ones)
function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

// update the "Score: X" text in the HTML
function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}
