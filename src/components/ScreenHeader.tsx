import React from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import assets from '../assets';
import THEME from '../constants/theme';
import { HEADER_H, HEADER_TOP } from '../constants/layout';
import usePressScale from '../hooks/usePressScale';
import { BUTTON_GAP, ICON_SIZE } from './PrimaryButton';

type Props = {
  title: string;
  subtitle?: string;
  onMenu?: () => void;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  reducedMotion?: boolean;
};

/** The MENU pill: icon_home PNG + the literal word MENU the UI harness taps. */
export function MenuPillButton({
  onPress,
  reducedMotion = false,
}: {
  onPress: () => void;
  reducedMotion?: boolean;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(!reducedMotion);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="MENU"
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.menuPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.menuShell, { transform: [{ scale }] }]}>
        <View style={styles.menuRow}>
          <Image
            source={assets.iconHome}
            resizeMode="contain"
            style={styles.menuIcon}
          />
          <Text style={styles.menuLabel}>MENU</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

/**
 * One header component reused by every screen — only the slots change, so the
 * styling cannot drift between screens.
 */
export function ScreenHeader({
  title,
  subtitle,
  onMenu,
  leftSlot,
  rightSlot,
  reducedMotion = false,
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {leftSlot ? leftSlot : null}
        {!leftSlot && onMenu ? (
          <MenuPillButton onPress={onMenu} reducedMotion={reducedMotion} />
        ) : null}
      </View>

      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.sideRight}>{rightSlot ? rightSlot : null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: HEADER_TOP,
    height: HEADER_TOP + HEADER_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  side: {
    width: 110,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    width: 110,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: THEME.colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  menuPress: {
    width: 104,
    height: 48,
  },
  menuShell: {
    width: 104,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(10,31,20,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: BUTTON_GAP,
  },
  menuIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  menuLabel: {
    fontSize: 13,
    lineHeight: ICON_SIZE,
    fontWeight: '800',
    letterSpacing: 1,
    color: THEME.colors.text.primary,
  },
});

export default ScreenHeader;
