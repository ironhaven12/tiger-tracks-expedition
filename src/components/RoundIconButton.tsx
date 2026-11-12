import React from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import assets from '../assets';
import THEME from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

type Props = {
  source: ImageSourcePropType;
  label: string;
  onPress: () => void;
  reducedMotion?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const SIZE = 48;

/** 48px round clay button carrying one of the two navigation PNG glyphs. */
export function RoundIconButton({
  source,
  label,
  onPress,
  reducedMotion = false,
  style,
  testID,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(!reducedMotion);

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.shell, { transform: [{ scale }] }]}>
        <Image
          source={assets.buttonRound}
          resizeMode="contain"
          style={styles.texture}
        />
        <Image source={source} resizeMode="contain" style={styles.glyph} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: SIZE,
    height: SIZE,
  },
  shell: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(10,31,20,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...THEME.shadows.clay,
  },
  texture: {
    ...StyleSheet.absoluteFillObject,
    width: SIZE,
    height: SIZE,
    opacity: 0.4,
  },
  glyph: {
    width: 24,
    height: 24,
  },
});

export default RoundIconButton;
