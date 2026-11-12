import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import THEME from '../constants/theme';

type Props = {
  text: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/** Themed empty state — a container is never left as a blank area. */
export function EmptyNote({ text, style, children }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.text}>{text}</Text>
      {children ? <View style={styles.action}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: THEME.colors.text.muted,
    textAlign: 'center',
  },
  action: {
    marginTop: 14,
    width: '100%',
  },
});

export default EmptyNote;
