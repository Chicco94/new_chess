import { BOARD_WIDTH,BOARD_HEIGHT,BLACK,WHITE,BLACK_SOLDIER,BLACK_ARCHER,BLACK_KNIGHT,BLACK_SPEAR, WHITE_ARCHER } from "./consts.js";

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
    player = changePlayer(player);
    return [board,player];
}


