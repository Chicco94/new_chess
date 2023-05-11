import { BOARD_HEIGHT, BOARD_WIDTH, BLACK,WHITE,BLACK_SOLDIER,BLACK_ARCHER,BLACK_KNIGHT,BLACK_SPEAR, WHITE_SOLDIER,WHITE_ARCHER,WHITE_KNIGHT,WHITE_SPEAR } from "./consts.js";

/**
 * @param {*} player 
 * @returns the opposite color player
 */
export function changePlayer(player){
    return player == WHITE ? BLACK : WHITE;
}


/**
 * @param {*} piece piece
 * @return piece side
 */
export function getSide(piece){
    if ([BLACK_SOLDIER,BLACK_ARCHER,BLACK_KNIGHT,BLACK_SPEAR].includes(piece)) return BLACK;
    return WHITE;
}


/**
 * 
 * @param {*} board 
 * @param {*} X 
 * @param {*} Y 
 * @returns 
 */
export function getPiece(board,X,Y){
    return board[Y][X];
}


/**
 * 
 * @param {*} board board before the move
 * @param {*} current_X starting X
 * @param {*} current_Y starting Y
 * @param {*} landing_X landing X
 * @param {*} landing_Y landing Y
 * @param {*} player player who does the move
 * @returns board updated
 */
export function makeMove(board,current_X,current_Y,landing_X,landing_Y,player,isAttack=false){
    let piece = getPiece(board,current_X,current_Y);
    // archer attacks without moving
    if ([BLACK_ARCHER,WHITE_ARCHER].includes(piece) && isAttack){
        board[landing_Y][landing_X] = null;
    } else {
        //other pieces must move in landing square to attack
        board[landing_Y][landing_X] = board[current_Y][current_X];
        board[current_Y][current_X] = null;
    }

    const winner = checkWinner(board);
    if (winner){
        showGameOverModal(winner)
    }
    player = changePlayer(player);
    return [board,player];
}


function checkWinner(board){
    let black_counter = 0;
    let white_counter = 0;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            let piece = board[y][x];
            if (getSide(piece)==WHITE){
                white_counter += 1;
            } else {
                black_counter += 1;
            }
        }
    } 
    if (black_counter == 0) return WHITE;
    if (white_counter == 0) return BLACK;
    return false;
}


export function showGameOverModal(winner) {
    const modal = document.getElementById("game-over-modal");
    const message = `Game over! Player ${winner} wins!`;
    modal.querySelector("p").textContent = message;
    modal.style.display = "block";
}



export function resetBoard(){
    return [
        [BLACK_KNIGHT,BLACK_KNIGHT,BLACK_ARCHER, BLACK_ARCHER, BLACK_ARCHER, BLACK_ARCHER, BLACK_ARCHER,  BLACK_KNIGHT, BLACK_KNIGHT],
        [BLACK_KNIGHT,BLACK_KNIGHT,BLACK_SOLDIER, BLACK_SOLDIER, BLACK_SOLDIER, BLACK_SOLDIER, BLACK_SOLDIER, BLACK_KNIGHT, BLACK_KNIGHT],
        [ null,null,BLACK_SPEAR, BLACK_SPEAR, BLACK_SPEAR, BLACK_SPEAR, BLACK_SPEAR,  null, null],
        [null,null, null, null, null, null, null, null, null],
        [null,null, null, null, null, null, null, null, null],
        [null,null, null, null, null, null, null, null, null],
        [ null,null, WHITE_SPEAR, WHITE_SPEAR, WHITE_SPEAR, WHITE_SPEAR, WHITE_SPEAR, null, null],
        [WHITE_KNIGHT,WHITE_KNIGHT,WHITE_SOLDIER, WHITE_SOLDIER, WHITE_SOLDIER, WHITE_SOLDIER, WHITE_SOLDIER, WHITE_KNIGHT, WHITE_KNIGHT],
        [WHITE_KNIGHT,WHITE_KNIGHT,WHITE_ARCHER, WHITE_ARCHER, WHITE_ARCHER, WHITE_ARCHER, WHITE_ARCHER,  WHITE_KNIGHT, WHITE_KNIGHT],
    ];
}