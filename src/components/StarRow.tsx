import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import THEME from '../constants/theme';

const STAR_PATH =
  'M50 6 L62 38 L96 38 L68 58 L79 92 L50 71 L21 92 L32 58 L4 38 L38 38 Z';

export function StarGlyph({
  size = 16,
  color = THEME.colors.gold,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d={STAR_PATH} fill={color} />
    </Svg>
  );
}

type Props = {
  earned: number;
  total?: number;
  size?: number;
  gap?: number;
};

export function StarRow({ earned, total = 3, size = 16, gap = 4 }: Props) {
  const stars = [];
  for (let i = 0; i < total; i++) {
    stars.push(
      <StarGlyph
        key={`star-${i}`}
        size={size}
        color={i < earned ? THEME.colors.gold : 'rgba(255,255,255,0.14)'}
      />,
    );
  }
  return <View style={[styles.row, { gap }]}>{stars}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default StarRow;
