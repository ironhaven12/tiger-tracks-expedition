import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Sun } from 'lucide-react-native';
import THEME from '../constants/theme';

type Props = {
  left: number;
  total: number;
  reducedMotion: boolean;
};

const BAR_W = 56;
const BAR_H = 6;

function barColor(share: number): string {
  if (share <= 0.25) {
    return THEME.colors.error;
  }
  if (share <= 0.5) {
    return THEME.colors.orange;
  }
  return THEME.colors.gold;
}

export function DaylightMeter({ left, total, reducedMotion }: Props) {
  const share = total > 0 ? Math.max(0, Math.min(1, left / total)) : 0;
  // width is a layout property: the driver MUST stay on the JS side.
  const width = useRef(new Animated.Value(BAR_W * share)).current;
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: BAR_W * share,
      duration: reducedMotion ? 90 : 220,
      useNativeDriver: false,
    }).start();

    if (reducedMotion) {
      return;
    }
    pop.setValue(1);
    Animated.sequence([
      Animated.timing(pop, { toValue: 1.12, duration: 110, useNativeDriver: true }),
      Animated.timing(pop, { toValue: 1, duration: 110, useNativeDriver: true }),
    ]).start();
  }, [share, reducedMotion, width, pop]);

  return (
    <View style={styles.pill}>
      <Sun size={20} color={THEME.colors.gold} strokeWidth={2.2} />
      <View style={styles.right}>
        <Animated.Text
          style={[styles.value, { transform: [{ scale: pop }] }]}
          numberOfLines={1}>
          {String(Math.max(0, left))}
        </Animated.Text>
        <View style={styles.track}>
          <Animated.View
            pointerEvents="none"
            style={[styles.fill, { width, backgroundColor: barColor(share) }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: 96,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(10,31,20,0.80)',
    borderWidth: 1,
    borderColor: 'rgba(255,194,71,0.32)',
  },
  right: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  value: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
    color: THEME.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  track: {
    marginTop: 3,
    width: BAR_W,
    height: BAR_H,
    borderRadius: BAR_H / 2,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  fill: {
    height: BAR_H,
    borderRadius: BAR_H / 2,
  },
});

export default DaylightMeter;
