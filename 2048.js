let board = []; //holds the gird
let score = 0;
const rows = 4;
const columns = 4;

//initialisation
window.onload = function(){
    setGame();
}

function setGame(){
    // this is done so that the board initially is empty and initialised you wont see it ever all empty 

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    //    board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ];
    //loop through every position in the grid
    for ( let r = 0; r < rows; r++){
        for (let c = 0; c < columns; c++){

            //create an empty div element in the memory (not yet in the page)
            let tile = document.createElement("div");


            //each tile gets a unique id for its position  r = 2 c = 3 will give id 2-3
            tile.id = r.toString() + "-" + c.toString();

            //num is stored in the board at this location
            let num = board[r][c];
            
            //update the tile appearance on the basis of the number
            updateTile (tile,num);

            //actually put the tile in the html div
            document.getElementById("board").append(tile)

        }
    }
    setTwo();
    setTwo();
}

// update the tile
function updateTile (tile, num){
    tile.innerText = "";         //clears old text
    tile.classList.value = "";   //any old css classes
    tile.classList.add("tile");  // gives the tile dive the basic tile class for size and all

    //basically a checker to ensure something is only showed on the board if the number > 0
    if (num > 0){

        //loads the number into the tile
        tile.innerText = num;

        //diff numbers get their respective colors/styles
        if (num <= 4096) {

            tile.classList.add("x"+num.toString()); // loading up the x2 x4 etc

        }
        else
        {
            //using the standard display for numbers beyond 9182
            tile.classList.add("x9182");
        }
    }

}


//listen for the when the arrow is pressed
document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft"){
        //if left is pressed trigger slideleft();
        slideLeft();
    }
     else if (e.code == "ArrowRight"){
        //if right is pressed trigger slideright();
        slideRight();
    }
     else if (e.code == "ArrowUp"){
        //if right is pressed trigger slideright();
        slideUp();
    }
     else if (e.code == "ArrowDown"){
        //if right is pressed trigger slideright();
        slideDown();
    }
})


//remove the zeroes from row and only keep numbers 
// [2.0.2.4] becomes [2.2.4]
function filterZero(row)
{
    return row.filter(num => num != 0);    //creates a new array without zeros 
}


function slide(row){ 

    row = filterZero(row); //get rid of zeroes

    //slide
    for (let i = 0; i < row.length-1; i++)
    // check every 2    
    {
        if (row[i] == row[i+1]){
            row[i] *= 2 ;
            row[i + 1] = 0 ;
            score += row[i];
        }

    }
    row = filterZero(row);

    //add zeroes
    while(row.length < columns){
        row.push(0);
    }
    return row;
}




function slideLeft() {
    for (let r = 0; r < rows; r++){
        let row = board [r];
        row = slide(row);
        board[r] =row;

        for (let c = 0; c < columns; c++)
        {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num);

        }
    }
    setTwo();

}

function slideRight() {
    for (let r = 0; r < rows; r++){
        let row = board [r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] =row;

        for (let c = 0; c < columns; c++)
        {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num);

        }
    }
    setTwo();

}


function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    setTwo();

}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    setTwo();

}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}
