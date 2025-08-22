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

    // board = [
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0]
    // ]

      board = [
        [2, 16, 2048, 4096],
        [4, 32, 1024, 2],
        [6, 64, 512, 4],
        [8, 128, 256, 16]
    ]
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
            row[1] *= 2 ;
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
}
