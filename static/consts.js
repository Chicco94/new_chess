export const BOARD_WIDTH = 9;
export const BOARD_HEIGHT = 9;

// Define piece types
export const BLACK_SOLDIER = "br";
export const BLACK_ARCHER = "bb";
export const BLACK_KNIGHT = "bn";
export const BLACK_SPEAR = "bp";

export const WHITE_SOLDIER = "wr";
export const WHITE_ARCHER = "wb";
export const WHITE_KNIGHT = "wn";
export const WHITE_SPEAR = "wp";

// Define piece colors
export const WHITE = "W";
export const BLACK = "B";

export const BOARD = [
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