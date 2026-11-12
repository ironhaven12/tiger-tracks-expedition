import { Dimensions } from 'react-native';
import { GRID_COLS, GRID_ROWS } from './config';

const win = Dimensions.get('window');

export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

/** Status bar room — the app is not fullscreen (rule 10.6). */
export const HEADER_TOP = 44;
export const HEADER_H = 72;
export const HEADER_TOTAL = HEADER_TOP + HEADER_H;

export const ROUTE_STRIP_H = 64;
export const CONTROL_BAR_H = 72;
export const CONTROL_BAR_BOTTOM = 24;

/** padding 6 + border 2 on each side */
export const BOARD_FRAME = 6 + 2;

export const GRID_MAX_W = Math.min(SCREEN_W - 32, 344);

/** Two-column card grids (levels, collection) share this frame formula. */
export const CARD_W = Math.floor((GRID_MAX_W - 2 * BOARD_FRAME - 14) / 2);
export const GRID_W = CARD_W * 2 + 14 + 2 * BOARD_FRAME;

/**
 * The tile is clamped by BOTH the usable width and the usable height so the
 * board can never slide under the floating control bar.
 */
export function tileSize(preferred: number): number {
  const byWidth = Math.floor((GRID_MAX_W - 2 * BOARD_FRAME) / GRID_COLS);
  const availH =
    SCREEN_H -
    HEADER_TOTAL -
    ROUTE_STRIP_H -
    CONTROL_BAR_H -
    CONTROL_BAR_BOTTOM -
    40;
  const byHeight = Math.floor((availH - 2 * BOARD_FRAME) / GRID_ROWS);
  return Math.max(44, Math.min(preferred, byWidth, byHeight));
}

export function boardWidth(tile: number): number {
  return tile * GRID_COLS + 2 * BOARD_FRAME;
}

export function boardHeight(tile: number): number {
  return tile * GRID_ROWS + 2 * BOARD_FRAME;
}
