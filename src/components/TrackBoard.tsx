import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GRID_COLS, SpeciesId } from '../constants/config';
import { BOARD_FRAME, boardHeight, boardWidth } from '../constants/layout';
import THEME from '../constants/theme';
import { Cell } from '../game/levelGenerator';
import ThicketCell, { CellVisual } from './ThicketCell';

type Props = {
  cells: Cell[];
  revealed: boolean[];
  scanned: boolean[];
  tile: number;
  hintsOn: boolean;
  reducedMotion: boolean;
  onSweep: (index: number) => void;
};

function visualFor(cell: Cell, isRevealed: boolean): CellVisual {
  if (!isRevealed) {
    return 'closed';
  }
  if (cell.kind === 'track') {
    return 'track';
  }
  if (cell.kind === 'thorn') {
    return 'thorn';
  }
  return 'empty';
}

/** The 4x5 thicket grid; it owns the BOARD_FRAME geometry. */
export function TrackBoard({
  cells,
  revealed,
  scanned,
  tile,
  hintsOn,
  reducedMotion,
  onSweep,
}: Props) {
  const rows: number[][] = [];
  for (let i = 0; i < cells.length; i += GRID_COLS) {
    rows.push(
      Array.from({ length: GRID_COLS }, (_, c) => i + c).filter(
        idx => idx < cells.length,
      ),
    );
  }

  return (
    <View
      style={[
        styles.board,
        { width: boardWidth(tile), height: boardHeight(tile) },
      ]}>
      <View pointerEvents="none" style={styles.innerLight} />
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map(index => (
            <ThicketCell
              key={`cell-${index}`}
              index={index}
              size={tile}
              visual={visualFor(cells[index], revealed[index])}
              proximity={cells[index].proximity}
              species={cells[index].species as SpeciesId | null}
              scanned={scanned[index]}
              hintsOn={hintsOn}
              reducedMotion={reducedMotion}
              onPress={onSweep}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignSelf: 'center',
    padding: BOARD_FRAME - 2,
    borderWidth: 2,
    borderColor: 'rgba(0,230,118,0.20)',
    borderRadius: 28,
    backgroundColor: THEME.colors.bg.sunken,
    overflow: 'hidden',
    ...THEME.shadows.clay,
  },
  innerLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: THEME.colors.ui.innerLight,
  },
  row: {
    flexDirection: 'row',
  },
});

export default TrackBoard;
