// Define chessboard dimensions
const BOARD_WIDTH = 11;
const BOARD_HEIGHT = 11;

// Define piece types
const BLACK_KING = "bk";
const BLACK_QUEEN = "bq";
const BLACK_ROOK = "br";
const BLACK_BISHOP = "bb";
const BLACK_KNIGHT = "bn";
const BLACK_PAWN = "bp";

const WHITE_KING = "wk";
const WHITE_QUEEN = "wq";
const WHITE_ROOK = "wr";
const WHITE_BISHOP = "wb";
const WHITE_KNIGHT = "wn";
const WHITE_PAWN = "wp";

// Define piece colors
const WHITE = "W";
const BLACK = "B";



// Create an array to represent the initial state of the chessboard
var board = [
	[null,BLACK_KNIGHT,BLACK_KNIGHT,BLACK_BISHOP, BLACK_BISHOP, BLACK_BISHOP, BLACK_BISHOP, BLACK_BISHOP,  BLACK_KNIGHT, BLACK_KNIGHT, null],
	[null,BLACK_KNIGHT,BLACK_KNIGHT,BLACK_ROOK, BLACK_ROOK, BLACK_ROOK, BLACK_ROOK, BLACK_ROOK, BLACK_KNIGHT, BLACK_KNIGHT, null],
	[null, null,null,BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN,  null, null, null],
	[null,null,null, null, null, null, null, null, null, null, null],
	[null,null,null, null, null, null, null, null, null, null, null],
	[null,null,null, null, null, null, null, null, null, null, null],
	[null,null,null, null, null, null, null, null, null, null, null],
	[null,null,null, null, null, null, null, null, null, null, null],
	[null, null,null, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, null, null, null],
	[null,WHITE_KNIGHT,WHITE_KNIGHT,WHITE_ROOK, WHITE_ROOK, WHITE_ROOK, WHITE_ROOK, WHITE_ROOK, WHITE_KNIGHT, WHITE_KNIGHT, null],
	[null,WHITE_KNIGHT,WHITE_KNIGHT,WHITE_BISHOP, WHITE_BISHOP, WHITE_BISHOP, WHITE_BISHOP, WHITE_BISHOP,  WHITE_KNIGHT, WHITE_KNIGHT, null],
];

let player = '';
function setPlayer(_player){
    player = _player;
    console.log(player);
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
    event.dataTransfer.setData("text/plain", piece);

    // Add a "dragging" class to the piece image and to the square it's currently on
    const currentSquare = event.target.closest(".square");
    currentSquare.classList.add("dragging");
    pieceImg.classList.add("dragging");

    // highlight available cells
    const currentX = parseInt(currentSquare.dataset.x);
    const currentY = parseInt(currentSquare.dataset.y);
    for (let y = 0; y < BOARD_WIDTH; y++) {
        for (let x = 0; x < BOARD_HEIGHT; x++) {
            if (isValidMove(currentX, currentY, x, y, piece)) {
                const square = document.querySelector(`.square[data-x="${x}"][data-y="${y}"]`);
                if (square) {
                    square.classList.add("valid-move");
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
    const currentSquare = document.querySelector(".dragging");
    if (currentSquare) {
        const currentX = parseInt(currentSquare.dataset.x);
        const currentY = parseInt(currentSquare.dataset.y);
        const targetX = parseInt(square.dataset.x);
        const targetY = parseInt(square.dataset.y);
        if (isValidMove(currentX, currentY, targetX, targetY)) {
            square.classList.add("droppable");
        }
    }
    const validMoves = document.querySelectorAll(".valid-move");
    for (const validMove of validMoves) {
        validMove.classList.remove("valid-move");
    }
}

// Create a function to handle the dropping of a piece onto a square
function handleDrop(event) {
    event.preventDefault();

    const square = event.target;
    if (!square.classList.contains("square")) {
        console.error("Invalid drop target:", square);
        return;
    }

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

    const currentX = parseInt(currentSquare.dataset.x);
    const currentY = parseInt(currentSquare.dataset.y);
    const targetX = parseInt(square.dataset.x);
    const targetY = parseInt(square.dataset.y);
    if (isNaN(currentX) || isNaN(currentY) || isNaN(targetX) || isNaN(targetY)) {
        console.error("Invalid square data attributes:", currentSquare, square);
        return;
    }

    // Move the piece on the board and update the UI
    if (!isValidMove(currentX,currentY,targetX,targetY,piece)){
        console.error("Invalid move:", currentSquare, square);
        return;
    }
    board[targetY][targetX] = board[currentY][currentX];
    board[currentY][currentX] = null;
    generateChessboard();
}

// Create a function to handle the dragging of a piece over a square
function handleDragOver(event) {
    event.preventDefault();
}

// Create a function to check if a move is valid
function isValidMove(startX, startY, endX, endY,piece) {
    console.log(piece,player);
    if (board[endY][endX] != null) return false;
    if(player == WHITE && [BLACK_KING,BLACK_QUEEN,BLACK_ROOK,BLACK_BISHOP,BLACK_KNIGHT,BLACK_PAWN].includes(piece)) return false;
    if(player == BLACK && [WHITE_KING,WHITE_QUEEN,WHITE_ROOK,WHITE_BISHOP,WHITE_KNIGHT,WHITE_PAWN].includes(piece)) return false;
    if([BLACK_BISHOP,BLACK_PAWN,BLACK_ROOK,WHITE_BISHOP,WHITE_PAWN,WHITE_ROOK].includes(piece)){
        return Math.abs(startX-endX)<=1 && Math.abs(startY-endY)<=1;
    }
    if([BLACK_KNIGHT,WHITE_KNIGHT].includes(piece)){
        return Math.abs(startX-endX)<=2 && Math.abs(startY-endY)<=2;
    }
    return true;
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
