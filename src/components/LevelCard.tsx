import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import { TrailConfig } from '../constants/config';
import { CARD_W } from '../constants/layout';
import THEME from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import StarRow from './StarRow';

type Props = {
  trail: TrailConfig;
  stars: number;
  locked: boolean;
  selected: boolean;
  reducedMotion: boolean;
  onPress: (index: number) => void;
};

const CARD_H = 150;

export function LevelCard({
  trail,
  stars,
  locked,
  selected,
  reducedMotion,
  onPress,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(!reducedMotion);
  const shake = useRef(new Animated.Value(0)).current;
  const shakeTick = useRef(0);

  const handlePress = useCallback(() => {
    if (locked) {
      shakeTick.current += 1;
      shake.setValue(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
    onPress(trail.index);
  }, [locked, onPress, shake, trail.index]);

  useEffect(() => {
    return () => {
      shake.stopAnimation();
    };
  }, [shake]);

  const translateX = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: [-5, 5],
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`TRAIL ${trail.id} ${trail.name}`}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          locked ? styles.cardLocked : null,
          selected ? styles.cardSelected : null,
          { transform: [{ scale }, { translateX }] },
        ]}>
        <View pointerEvents="none" style={styles.innerLight} />
        {locked ? (
          <View style={styles.lockedBody}>
            <Lock size={22} color={THEME.colors.text.disabled} strokeWidth={2.2} />
            <Text style={styles.lockedTitle}>{`TRAIL ${trail.id}`}</Text>
            <Text style={styles.lockedCaption}>
              {`FINISH TRAIL ${padTrail(trail.index)}`}
            </Text>
            <Text style={styles.lockedHint}>COMPLETE THE PREVIOUS TRAIL FIRST</Text>
          </View>
        ) : (
          <View style={styles.body}>
            <Text style={styles.number}>{trail.id}</Text>
            <Text numberOfLines={1} style={styles.name}>
              {trail.name}
            </Text>
            <Text style={styles.meta}>
              {`${trail.tracksTotal} TRACKS · ${trail.daylight} DAYLIGHT`}
            </Text>
            <StarRow earned={stars} size={16} />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

function padTrail(index: number): string {
  const n = index; // the previous trail, 1-based
  return n < 10 ? `0${n}` : String(n);
}

const styles = StyleSheet.create({
  press: {
    width: CARD_W,
    height: CARD_H,
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(0,230,118,0.22)',
    backgroundColor: THEME.colors.bg.raised,
    overflow: 'hidden',
    ...THEME.shadows.clay,
  },
  cardLocked: {
    backgroundColor: '#13251C',
    borderColor: 'rgba(255,255,255,0.07)',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: THEME.colors.orange,
  },
  innerLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: THEME.colors.ui.innerLight,
  },
  body: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  number: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
    color: THEME.colors.gold,
    fontVariant: ['tabular-nums'],
  },
  name: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: THEME.colors.text.primary,
  },
  meta: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: THEME.colors.text.muted,
  },
  lockedBody: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  lockedTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1,
    color: THEME.colors.text.disabled,
  },
  lockedCaption: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: THEME.colors.text.disabled,
  },
  lockedHint: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: 'rgba(255,255,255,0.28)',
    textAlign: 'center',
  },
});

export default LevelCard;
