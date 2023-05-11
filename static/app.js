// Define chessboard dimensions
import { BOARD,BOARD_WIDTH,BOARD_HEIGHT,BLACK_SOLDIER,BLACK_ARCHER,BLACK_KNIGHT,BLACK_SPEAR,WHITE_SOLDIER,WHITE_ARCHER,WHITE_KNIGHT,WHITE_SPEAR,WHITE,BLACK } from "./consts.js";
import { getSide,makeMove } from "./utils.js";

// Create an array to represent the initial state of the chessboard
var board = BOARD;

let player = WHITE;

// Call the generateChessboard function to create the initial chessboard UI
generateChessboard();

/**
 * ######  ######     #     #####            ##            ######  ######  ####### ######
 * #     # #     #   # #   #     #          #  #           #     # #     # #     # #     #
 * #     # #     #  #   #  #                 ##            #     # #     # #     # #     #
 * #     # ######  #     # #  ####          ###            #     # ######  #     # ######
 * #     # #   #   ####### #     #         #   # #         #     # #   #   #     # #
 * #     # #    #  #     # #     #         #    #          #     # #    #  #     # #
 * ######  #     # #     #  #####           #### #         ######  #     # ####### #
 */

/**
 * handle the start of a drag-and-drop operation
 * @param {*} event 
 * @returns 
 */
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


/**
 * handle the end of a drag-and-drop operation
 * @param {*} event 
 * @returns void
 */
function handleDragEnd(event) {
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


/**
 * handle the dropping of a piece onto a square
 * @param {*} event 
 * @returns void
 */
function handleDrop(event) {
    event.preventDefault();
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
    
    const landing_square = event.target;
    let landing_X = parseInt(landing_square.dataset.x);
    let landing_Y = parseInt(landing_square.dataset.y);
    if (!isNaN(landing_X) && !isNaN(landing_Y)){
        if (isValidMove(current_X,current_Y,landing_X,landing_Y)){
            [board,player] = makeMove(board,current_X,current_Y,landing_X,landing_Y,player);
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
            [board,player] = makeMove(board,current_X,current_Y,landing_X,landing_Y,player,true);
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
    
    // players must move his own pieces
    if(player == WHITE && [BLACK_SOLDIER,BLACK_ARCHER,BLACK_KNIGHT,BLACK_SPEAR].includes(piece)) return false;
    if(player == BLACK && [WHITE_SOLDIER,WHITE_ARCHER,WHITE_KNIGHT,WHITE_SPEAR].includes(piece)) return false;
    
    // footman can only move at most one square
    if([BLACK_ARCHER,BLACK_SPEAR,BLACK_SOLDIER,WHITE_ARCHER,WHITE_SPEAR,WHITE_SOLDIER].includes(piece)){
        return Math.abs(startX-endX)<=1 && Math.abs(startY-endY)<=1;
    }

    // horseman can move at most two squares
    if([BLACK_KNIGHT,WHITE_KNIGHT].includes(piece)){
        return Math.abs(startX-endX)<=2 && Math.abs(startY-endY)<=2;
    }

    // something went wrong if we reach this state
    return false;
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
    if([BLACK_ARCHER,WHITE_ARCHER].includes(piece) && [BLACK_SOLDIER,WHITE_SOLDIER].includes(enemy)) return false;
    
    // knights and archer can attack from 2 squares
    if([BLACK_ARCHER,WHITE_ARCHER,BLACK_KNIGHT,WHITE_KNIGHT].includes(piece)){
        return Math.abs(startX-endX)<=2 && Math.abs(startY-endY)<=2;
    }

    // other pieces must by in direct contact with the enemy
    return Math.abs(startX-endX)<=1 && Math.abs(startY-endY)<=1;
}


/**
 * generate the chessboard UI
 */
export function generateChessboard() {
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



