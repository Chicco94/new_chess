// Define chessboard dimensions
const BOARD_WIDTH = 11;
const BOARD_HEIGHT = 11;

// Define piece types
const BLACK_SOLDIER = "br";
const BLACK_ARCER = "bb";
const BLACK_KNIGHT = "bn";
const BLACK_SPEAR = "bp";

const WHITE_SOLDIER = "wr";
const WHITE_ARCER = "wb";
const WHITE_KNIGHT = "wn";
const WHITE_SPEAR = "wp";

// Define piece colors
const WHITE = "W";
const BLACK = "B";


// Create an array to represent the initial state of the chessboard
var board = [
	[null,BLACK_KNIGHT,BLACK_KNIGHT,BLACK_ARCER, BLACK_ARCER, BLACK_ARCER, BLACK_ARCER, BLACK_ARCER,  BLACK_KNIGHT, BLACK_KNIGHT, null],
	[null,BLACK_KNIGHT,BLACK_KNIGHT,BLACK_SOLDIER, BLACK_SOLDIER, BLACK_SOLDIER, BLACK_SOLDIER, BLACK_SOLDIER, BLACK_KNIGHT, BLACK_KNIGHT, null],
	[null, null,null,BLACK_SPEAR, BLACK_SPEAR, BLACK_SPEAR, BLACK_SPEAR, BLACK_SPEAR,  null, null, null],
	[null,null,null, null, null, null, null, null, null, null, null],
	[null,null,null, null, null, null, null, null, null, null, null],
	[null,null,null, null, null, null, null, null, null, null, null],
	[null,null,null, null, null, null, null, null, null, null, null],
	[null,null,null, null, null, null, null, null, null, null, null],
	[null, null,null, WHITE_SPEAR, WHITE_SPEAR, WHITE_SPEAR, WHITE_SPEAR, WHITE_SPEAR, null, null, null],
	[null,WHITE_KNIGHT,WHITE_KNIGHT,WHITE_SOLDIER, WHITE_SOLDIER, WHITE_SOLDIER, WHITE_SOLDIER, WHITE_SOLDIER, WHITE_KNIGHT, WHITE_KNIGHT, null],
	[null,WHITE_KNIGHT,WHITE_KNIGHT,WHITE_ARCER, WHITE_ARCER, WHITE_ARCER, WHITE_ARCER, WHITE_ARCER,  WHITE_KNIGHT, WHITE_KNIGHT, null],
];

let player = WHITE;
function setPlayer(_player){
    player = _player;
}

/**
 * ######  ######     #     #####            ##            ######  ######  ####### ######
 * #     # #     #   # #   #     #          #  #           #     # #     # #     # #     #
 * #     # #     #  #   #  #                 ##            #     # #     # #     # #     #
 * #     # ######  #     # #  ####          ###            #     # ######  #     # ######
 * #     # #   #   ####### #     #         #   # #         #     # #   #   #     # #
 * #     # #    #  #     # #     #         #    #          #     # #    #  #     # #
 * ######  #     # #     #  #####           #### #         ######  #     # ####### #
 */

// Define the currently selected piece
let selectedPiece = null;

// Create a function to handle the start of a drag-and-drop operation
function handleDragStart(event) {
    const pieceImg = event.target;
    if (!pieceImg.classList.contains("piece")) {
        console.error("Invalid drag target:", pieceImg);
        return;
    }
    const piece = pieceImg.getAttribute("data-piece");
    if (!piece) {
        console.error("Missing data-piece attribute on piece image:", pieceImg);
        return;
    }
    if(getSide(piece) != player){
        console.error("Player must move his own pieces", pieceImg, player);
        return;
    }


    event.dataTransfer.setData("text/plain", piece);

    // Add a "dragging" class to the piece image and to the square it's currently on
    const currentSquare = event.target.closest(".square");
    currentSquare.classList.add("dragging");
    pieceImg.classList.add("dragging");


    const currentX = parseInt(currentSquare.dataset.x);
    const currentY = parseInt(currentSquare.dataset.y);
    

    for (let y = 0; y < BOARD_WIDTH; y++) {
        for (let x = 0; x < BOARD_HEIGHT; x++) {
            // highlight available move cells
            if (isValidMove(currentX, currentY, x, y)) {
                const square = document.querySelector(`.square[data-x="${x}"][data-y="${y}"]`);
                if (square) {
                    square.classList.add("valid-move");
                }
            }
            // highlight available attack cells
            if (isValidAttack(currentX, currentY, x, y)) {
                const square = document.querySelector(`.square[data-x="${x}"][data-y="${y}"]`);
                if (square) {
                    square.classList.add("valid-attack");
                }
            }
        }
    }
}

/** Create a function to handle the end of a drag-and-drop operation
*/
function handleDragEnd(event) {
    selectedPiece = null;
    const square = event.target.closest(".square");
    if (!square) return;
    if (!square.classList.contains("valid-move")) return;

    // remove highlight to valid moves
    const validMoves = document.querySelectorAll(".valid-move");
    for (const validMove of validMoves) {
        validMove.classList.remove("valid-move");
    }

    // remove highlight to attack moves
    const attackMoves = document.querySelectorAll(".attack-move");
    for (const attackMove of attackMoves) {
        attackMove.classList.remove("attack-move");
    }
}

// Create a function to handle the dropping of a piece onto a square
function handleDrop(event) {
    event.preventDefault();
    const landing_square = event.target;
    const piece = event.dataTransfer.getData("text/plain");
    if (!piece) {
        console.error("No data found in dataTransfer object:", event.dataTransfer);
        return;
    }

    const currentSquare = document.querySelector(".dragging");
    if (!currentSquare) {
        console.error("No element found with class 'dragging'");
        return;
    }

    let current_X = parseInt(currentSquare.dataset.x);
    let current_Y = parseInt(currentSquare.dataset.y);
    if(isNaN(current_X) || isNaN(current_Y)){
        console.error("Invalid starting square data attributes:", currentSquare);
        return;
    }
    
    let landing_X = parseInt(landing_square.dataset.x);
    let landing_Y = parseInt(landing_square.dataset.y);
    if (!isNaN(landing_X) && !isNaN(landing_Y)){
        if (isValidMove(current_X,current_Y,landing_X,landing_Y)){
            board[landing_Y][landing_X] = board[current_Y][current_X];
            board[current_Y][current_X] = null;
            setPlayer(player == WHITE ? BLACK : WHITE);
            return generateChessboard();
        } else {
            console.error("Invalid landing data attributes:", landing_square);
            return;
        }
    } 
    
    landing_X = parseInt(landing_square.parentNode.dataset.x);
    landing_Y = parseInt(landing_square.parentNode.dataset.y);
    if (!isNaN(landing_X) && !isNaN(landing_Y)){
        if (isValidAttack(current_X,current_Y,landing_X,landing_Y)){
            board[landing_Y][landing_X] = board[current_Y][current_X];
            board[current_Y][current_X] = null;
            setPlayer(player == WHITE ? BLACK : WHITE);
            return generateChessboard();
        } else {
            console.error("Invalid attacking data attributes:", landing_square);
            return;
        }
    }
}

// Create a function to handle the dragging of a piece over a square
function handleDragOver(event) {
    event.preventDefault();
}


/**
 * @param {*} startX starting X
 * @param {*} startY starting Y
 * @param {*} endX ending X (must be clear return true)
 * @param {*} endY ending Y (must be clear to return true)
 * @returns true if a move is valid, false otherwise
 */
function isValidMove(startX, startY, endX, endY) {
    let piece = board[startY][startX];
    let enemy = board[endY][endX];
    if (startX==endX && startY== endY) return false;
    if (enemy != null) return false;
    
    if(player == WHITE && [BLACK_SOLDIER,BLACK_ARCER,BLACK_KNIGHT,BLACK_SPEAR].includes(piece)) return false;
    if(player == BLACK && [WHITE_SOLDIER,WHITE_ARCER,WHITE_KNIGHT,WHITE_SPEAR].includes(piece)) return false;
    if([BLACK_ARCER,BLACK_SPEAR,BLACK_SOLDIER,WHITE_ARCER,WHITE_SPEAR,WHITE_SOLDIER].includes(piece)){
        return Math.abs(startX-endX)<=1 && Math.abs(startY-endY)<=1;
    }
    if([BLACK_KNIGHT,WHITE_KNIGHT].includes(piece)){
        return Math.abs(startX-endX)<=2 && Math.abs(startY-endY)<=2;
    }
    return true;
}

/**
 * @param {*} startX starting X
 * @param {*} startY starting Y
 * @param {*} endX ending X (must be opponent piece to return true)
 * @param {*} endY ending Y (must be opponent piece to return true)
 * @returns true if it a possible cell to attack, false otherwise
 */
function isValidAttack(startX, startY, endX, endY) {
    let piece = board[startY][startX];
    let enemy = board[endY][endX];
    if (startX==endX && startY== endY) return false;
    if (enemy == null) return false;
    if(getSide(piece) == getSide(enemy)) return false;

    // a knight cannot attack a spearman
    if([BLACK_KNIGHT,WHITE_KNIGHT].includes(piece) && [BLACK_SPEAR,WHITE_SPEAR].includes(enemy)) return false;

    // an arcer cannot attack a soldier
    if([BLACK_ARCER,WHITE_ARCER].includes(piece) && [BLACK_SOLDIER,WHITE_SOLDIER].includes(enemy)) return false;
    
    if([BLACK_ARCER,WHITE_ARCER,BLACK_KNIGHT,WHITE_KNIGHT].includes(piece)){
        return Math.abs(startX-endX)<=2 && Math.abs(startY-endY)<=2;
    }
    return Math.abs(startX-endX)<=1 && Math.abs(startY-endY)<=1;
}


/**
 * @param {*} piece piece
 * @return piece side
 */
function getSide(piece){
    if ([BLACK_SOLDIER,BLACK_ARCER,BLACK_KNIGHT,BLACK_SPEAR].includes(piece)) return BLACK;
    return WHITE;
}

/**
 * #     #   ###
 * #     #    #
 * #     #    #
 * #     #    #
 * #     #    #
 * #     #    #
 *  #####    ###
 */

// Create a function to generate the chessboard UI
function generateChessboard() {
    const chessboard = document.getElementById("chessboard");
    chessboard.innerHTML = "";

    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            const square = document.createElement("div");
            square.classList.add("square");

            // Set the square color based on its position on the board
            if ((x + y) % 2 === 0) {
                square.classList.add("light-square");
            } else {
                square.classList.add("dark-square");
            }

            // Add event listeners for drag-and-drop functionality
            square.addEventListener("dragover", handleDragOver);
            square.addEventListener("drop", handleDrop);
            square.dataset.x = x;
            square.dataset.y = y;


            // Add a piece image to the square if there's a piece at that position on the board
            const piece = board[y][x];
            if (piece) {
                const pieceImg = document.createElement("img");
                pieceImg.classList.add("piece");
                pieceImg.draggable = true;
                pieceImg.src = `static/images/${piece}.png`;
                pieceImg.setAttribute("data-piece", piece);

                // Add event listeners for drag-and-drop functionality
                pieceImg.addEventListener("dragstart", handleDragStart);
                pieceImg.addEventListener("dragend", handleDragEnd);

                square.appendChild(pieceImg);
            }

            chessboard.appendChild(square);
        }
    }
}

//----------------------------------------------------------------------------------





// Call the generateChessboard function to create the initial chessboard UI
generateChessboard();
