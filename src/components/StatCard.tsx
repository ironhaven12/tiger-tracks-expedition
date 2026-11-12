import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Search } from 'lucide-react-native';
import THEME from '../constants/theme';
import ClaySurface from './ClaySurface';

export type StatItem = {
  key: string;
  value: string;
  label: string;
  valueColor: string;
};

type Props = StatItem & { style?: StyleProp<ViewStyle> };

const ICON_BOX = 44;
const ICON = 28;

/**
 * ONE icon for every pill in the app; the colour, the label and the number do
 * the differentiating. Cover the icons with a finger and all pills look
 * identical — which is the point (rule 15).
 */
export function StatCard({ value, label, valueColor, style }: Props) {
  if (!value || value === '0') {
    return null;
  }
  return (
    <ClaySurface
      tone="raised"
      radius={THEME.radius.chip}
      style={[styles.card, style]}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: valueColor + '22', borderColor: valueColor + '55' },
        ]}>
        <Search size={ICON} color={valueColor} strokeWidth={2.2} />
      </View>
      <Text numberOfLines={1} style={[styles.value, { color: valueColor }]}>
        {value}
      </Text>
      <Text numberOfLines={1} style={styles.label}>
        {label}
      </Text>
    </ClaySurface>
  );
}

/** A stat row is only drawn when at least two pills have something to say. */
export function StatRow({
  items,
  gap = 10,
  style,
}: {
  items: StatItem[];
  gap?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const visible = items.filter(item => item.value && item.value !== '0');
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={[styles.row, { gap }, style]}>
      {visible.map(item => (
        <View key={item.key} style={styles.slot}>
          <StatCard
            key={item.key}
            value={item.value}
            label={item.label}
            valueColor={item.valueColor}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  slot: {
    flex: 1,
  },
  // width:'100%' — never flex:1 inside a flex:1 slot (circular-flex bug).
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: ICON_BOX,
    height: ICON_BOX,
    borderRadius: ICON_BOX / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
});

export default StatCard;
