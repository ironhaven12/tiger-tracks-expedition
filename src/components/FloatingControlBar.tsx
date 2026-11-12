import React from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Eye, Flame, Search } from 'lucide-react-native';
import THEME from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import { BUTTON_GAP, ICON_SIZE } from './PrimaryButton';
import { CONTROL_BAR_BOTTOM, CONTROL_BAR_H } from '../constants/layout';

type Props = {
  streak: number;
  found: number;
  total: number;
  scansLeft: number;
  reducedMotion: boolean;
  onScan: () => void;
};

export function FloatingControlBar({
  streak,
  found,
  total,
  scansLeft,
  reducedMotion,
  onScan,
}: Props) {
  const disabled = scansLeft <= 0;
  const { scale, onPressIn, onPressOut } = usePressScale(!reducedMotion && !disabled);

  return (
    <View style={styles.bar}>
      <View pointerEvents="none" style={styles.innerLight} />

      <View style={styles.chip}>
        <Flame size={20} color={THEME.colors.orange} strokeWidth={2.2} />
        <View style={styles.chipText}>
          <Text style={styles.chipValue}>{`x${streak}`}</Text>
          <Text style={styles.chipLabel}>STREAK</Text>
        </View>
      </View>

      <View style={styles.chip}>
        <Search size={20} color={THEME.colors.green} strokeWidth={2.2} />
        <View style={styles.chipText}>
          <Text style={styles.chipValue}>{`${found}/${total}`}</Text>
          <Text style={styles.chipLabel}>FOUND</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={disabled ? 'NO SCANS LEFT' : 'SCAN'}
        disabled={disabled}
        onPress={onScan}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.scanPress}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.scanShell,
            disabled ? styles.scanDisabled : null,
            { transform: [{ scale }] },
          ]}>
          {disabled ? null : (
            <LinearGradient
              colors={[...THEME.gradients.scan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={styles.scanRow}>
            <Eye
              size={ICON_SIZE}
              color={disabled ? THEME.colors.text.disabled : '#06240F'}
              strokeWidth={2.4}
            />
            <Text
              numberOfLines={1}
              style={[styles.scanLabel, disabled ? styles.scanLabelOff : null]}>
              SCAN
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: CONTROL_BAR_BOTTOM,
    height: CONTROL_BAR_H,
    borderRadius: 28,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: 'rgba(19,45,30,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipText: {
    alignItems: 'flex-start',
  },
  chipValue: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
    color: THEME.colors.gold,
    fontVariant: ['tabular-nums'],
  },
  chipLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: THEME.colors.text.secondary,
  },
  scanPress: {
    width: 108,
    height: 52,
  },
  scanShell: {
    width: 108,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  scanDisabled: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.10)',
  },
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: BUTTON_GAP,
  },
  scanLabel: {
    fontSize: 14,
    lineHeight: ICON_SIZE,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: '#06240F',
  },
  scanLabelOff: {
    color: THEME.colors.text.disabled,
  },
});

export default FloatingControlBar;
