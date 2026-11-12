import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import THEME from '../constants/theme';

type Props = {
  text: string;
  visible: boolean;
};

/** Names the gesture AND its result, so the controls are never a guess. */
export function HintPill({ text, visible }: Props) {
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.radius.pill,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  text: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: THEME.colors.text.secondary,
  },
});

export default HintPill;
