import React from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import THEME from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import { BUTTON_GAP, ICON_SIZE } from './PrimaryButton';
import type { IconComponent } from './icons';



type Props = {
  label: string;
  Icon?: IconComponent;
  onPress: () => void;
  tone?: 'glass' | 'success' | 'danger';
  reducedMotion?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const TONE_BORDER = {
  glass: 'rgba(255,255,255,0.12)',
  success: 'rgba(0,230,118,0.45)',
  danger: 'rgba(255,59,48,0.55)',
};

const TONE_ICON = {
  glass: THEME.colors.green,
  success: THEME.colors.green,
  danger: THEME.colors.error,
};

export function SecondaryButton({
  label,
  Icon,
  onPress,
  tone = 'glass',
  reducedMotion = false,
  disabled = false,
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
        style={[
          styles.shell,
          { borderColor: TONE_BORDER[tone], transform: [{ scale }] },
          disabled ? styles.shellDisabled : null,
        ]}>
        <View pointerEvents="none" style={styles.innerLight} />
        <View style={styles.row}>
          {Icon ? (
            <Icon
              size={ICON_SIZE}
              color={disabled ? THEME.colors.text.disabled : TONE_ICON[tone]}
              strokeWidth={2.2}
            />
          ) : null}
          <Text
            numberOfLines={1}
            style={[styles.label, disabled ? styles.labelDisabled : null]}>
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
    height: 50,
  },
  shell: {
    width: '100%',
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: THEME.colors.ui.glass,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shellDisabled: {
    backgroundColor: 'rgba(255,255,255,0.04)',
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: BUTTON_GAP,
  },
  label: {
    fontSize: 13,
    lineHeight: ICON_SIZE,
    fontWeight: '800',
    letterSpacing: 1,
    color: THEME.colors.text.primary,
  },
  labelDisabled: {
    color: THEME.colors.text.disabled,
  },
});

export default SecondaryButton;
