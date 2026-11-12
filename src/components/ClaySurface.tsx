import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import THEME from '../constants/theme';

type Tone = 'raised' | 'sunken' | 'sheet' | 'glass' | 'danger';

type Props = {
  radius?: number;
  tone?: Tone;
  style?: StyleProp<ViewStyle>;
  deep?: boolean;
  children?: React.ReactNode;
  pointerEventsNone?: boolean;
};

const FILL: Record<Tone, string> = {
  raised: THEME.colors.bg.raised,
  sunken: THEME.colors.bg.sunken,
  sheet: THEME.colors.bg.sheet,
  glass: THEME.colors.ui.glass,
  danger: THEME.colors.bg.thorn,
};

const BORDER: Record<Tone, string> = {
  raised: 'rgba(0,230,118,0.22)',
  sunken: 'rgba(0,230,118,0.20)',
  sheet: 'rgba(255,255,255,0.10)',
  glass: 'rgba(255,255,255,0.12)',
  danger: 'rgba(255,109,0,0.45)',
};

/**
 * The single claymorphic primitive: outer soft shadow + a 1px inner light
 * line along the top edge.
 */
export function ClaySurface({
  radius = THEME.radius.panel,
  tone = 'raised',
  style,
  deep = false,
  children,
}: Props) {
  return (
    <View
      style={[
        styles.base,
        deep ? THEME.shadows.clayDeep : THEME.shadows.clay,
        {
          borderRadius: radius,
          backgroundColor: FILL[tone],
          borderColor: BORDER[tone],
        },
        style,
      ]}>
      <View
        pointerEvents="none"
        style={[
          styles.innerLight,
          { borderTopLeftRadius: radius, borderTopRightRadius: radius },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  innerLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: THEME.colors.ui.innerLight,
  },
});

export default ClaySurface;
