import React from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import THEME from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import type { IconComponent } from './icons';

export const ICON_SIZE = 24;
export const BUTTON_GAP = 10;



type Props = {
  label: string;
  Icon?: IconComponent;
  onPress: () => void;
  disabled?: boolean;
  reducedMotion?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function PrimaryButton({
  label,
  Icon,
  onPress,
  disabled = false,
  reducedMotion = false,
  style,
  testID,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(!reducedMotion && !disabled);

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.shell, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={
            disabled
              ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.05)']
              : [...THEME.gradients.cta]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Image
          source={assets.buttonRect}
          resizeMode="stretch"
          style={styles.texture}
        />
        <View pointerEvents="none" style={styles.innerLight} />
        <View style={styles.row}>
          {Icon ? (
            <Icon
              size={ICON_SIZE}
              color={disabled ? THEME.colors.text.disabled : THEME.colors.text.onAccent}
              strokeWidth={2.4}
            />
          ) : null}
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              disabled ? styles.labelDisabled : null,
            ]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 62,
  },
  shell: {
    width: '100%',
    height: 62,
    borderRadius: THEME.radius.cta,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.cta,
  },
  texture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  innerLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: BUTTON_GAP,
  },
  label: {
    fontSize: 18,
    lineHeight: ICON_SIZE,
    fontWeight: '900',
    letterSpacing: 1.6,
    color: THEME.colors.text.onAccent,
  },
  labelDisabled: {
    color: THEME.colors.text.disabled,
  },
});

export default PrimaryButton;
