export const BOARD_WIDTH = 11;
export const BOARD_HEIGHT = 11;

// Define piece types
export const BLACK_SOLDIER = "br";
export const BLACK_ARCER = "bb";
export const BLACK_KNIGHT = "bn";
export const BLACK_SPEAR = "bp";

export const WHITE_SOLDIER = "wr";
export const WHITE_ARCER = "wb";
export const WHITE_KNIGHT = "wn";
export const WHITE_SPEAR = "wp";

// Define piece colors
export const WHITE = "W";
export const BLACK = "B";

export const BOARD = [
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