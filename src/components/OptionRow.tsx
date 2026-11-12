import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import THEME from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import ClaySurface from './ClaySurface';

type Props = {
  title: string;
  caption: string;
  options: string[];
  value: string;
  reducedMotion: boolean;
  onChange: (value: string) => void;
};

function Chip({
  label,
  active,
  reducedMotion,
  onPress,
}: {
  label: string;
  active: boolean;
  reducedMotion: boolean;
  onPress: (label: string) => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(!reducedMotion);
  const handlePress = React.useCallback(() => onPress(label), [label, onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.chipPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.chip,
          active ? styles.chipActive : null,
          { transform: [{ scale }] },
        ]}>
        <Text
          numberOfLines={1}
          style={[styles.chipLabel, active ? styles.chipLabelActive : null]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

/** One settings row: a real option whose effect is described in the caption. */
export function OptionRow({
  title,
  caption,
  options,
  value,
  reducedMotion,
  onChange,
}: Props) {
  return (
    <ClaySurface tone="raised" radius={22} style={styles.row}>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.caption}>{caption}</Text>
      </View>
      <View style={styles.chips}>
        {options.map(option => (
          <Chip
            key={`${title}-${option}`}
            label={option}
            active={option === value}
            reducedMotion={reducedMotion}
            onPress={onChange}
          />
        ))}
      </View>
    </ClaySurface>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  texts: {
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: THEME.colors.text.primary,
  },
  caption: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: THEME.colors.text.secondary,
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipPress: {
    width: 96,
    height: 44,
  },
  chip: {
    width: 96,
    height: 44,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: THEME.colors.ui.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderColor: THEME.colors.green,
    backgroundColor: 'rgba(0,230,118,0.16)',
  },
  chipLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1,
    color: THEME.colors.text.secondary,
  },
  chipLabelActive: {
    color: THEME.colors.text.primary,
  },
});

export default OptionRow;
