import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SPRITES } from '../assets';
import { SpeciesId } from '../constants/config';
import THEME from '../constants/theme';
import { getSpecies } from '../game/species';
import usePressScale from '../hooks/usePressScale';

export type ChipState = 'idle' | 'correct' | 'wrong';

type Props = {
  species: SpeciesId;
  state: ChipState;
  width: number;
  reducedMotion: boolean;
  onPress: (species: SpeciesId) => void;
};

export function SpeciesChip({
  species,
  state,
  width,
  reducedMotion,
  onPress,
}: Props) {
  const info = getSpecies(species);
  const shake = useRef(new Animated.Value(0)).current;
  const { scale, onPressIn, onPressOut } = usePressScale(!reducedMotion);

  useEffect(() => {
    if (state !== 'wrong' || reducedMotion) {
      shake.setValue(0);
      return;
    }
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [state, reducedMotion, shake]);

  const handlePress = React.useCallback(() => {
    onPress(species);
  }, [onPress, species]);

  const translateX = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: [-6, 6],
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={info.name}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, { width }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.chip,
          { width },
          state === 'correct' ? styles.chipCorrect : null,
          state === 'wrong' ? styles.chipWrong : null,
          { transform: [{ scale }, { translateX }] },
        ]}>
        <View pointerEvents="none" style={styles.innerLight} />
        <Image
          source={SPRITES[info.spriteIndex]}
          resizeMode="contain"
          style={styles.sprite}
        />
        <Text numberOfLines={1} style={styles.name}>
          {info.name}
        </Text>
        {state === 'correct' ? (
          <Text style={styles.mark}>{'✓'}</Text>
        ) : null}
        {state === 'wrong' ? (
          <Text style={[styles.mark, styles.markWrong]}>{'✗'}</Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    height: 118,
  },
  chip: {
    height: 118,
    borderRadius: THEME.radius.chip,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: THEME.colors.bg.raised,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    ...THEME.shadows.clay,
  },
  chipCorrect: {
    borderColor: THEME.colors.green,
    borderWidth: 2,
  },
  chipWrong: {
    borderColor: THEME.colors.error,
    borderWidth: 2,
  },
  innerLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: THEME.colors.ui.innerLight,
  },
  sprite: {
    width: 64,
    height: 64,
  },
  name: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: THEME.colors.text.primary,
  },
  mark: {
    position: 'absolute',
    top: 6,
    right: 10,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
    color: THEME.colors.green,
  },
  markWrong: {
    color: THEME.colors.error,
  },
});

export default SpeciesChip;
