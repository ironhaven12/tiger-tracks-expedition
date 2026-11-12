import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SpeciesId } from '../constants/config';
import THEME from '../constants/theme';
import PawPrint from './PawPrint';
import SpeciesChip, { ChipState } from './SpeciesChip';

type Props = {
  species: SpeciesId;
  options: SpeciesId[];
  width: number;
  reducedMotion: boolean;
  onAnswer: (species: SpeciesId) => void;
};

/** The footprint question. Only its chips are interactive while it is open. */
export function MatchCard({
  species,
  options,
  width,
  reducedMotion,
  onAnswer,
}: Props) {
  const scale = useRef(new Animated.Value(reducedMotion ? 1 : 0.86)).current;
  const [picked, setPicked] = useState<SpeciesId | null>(null);
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    busy.current = false;
    setPicked(null);
    if (reducedMotion) {
      scale.setValue(1);
      return;
    }
    scale.setValue(0.86);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: THEME.animation.snappy.tension,
      friction: THEME.animation.snappy.friction,
    }).start();
  }, [species, options, reducedMotion, scale]);

  const handlePick = React.useCallback(
    (pick: SpeciesId) => {
      if (busy.current) {
        return;
      }
      busy.current = true;
      setPicked(pick);
      const delay = reducedMotion ? 120 : 360;
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        // the busy flag is always cleared where the feedback ends
        timer.current = null;
        busy.current = false;
        onAnswer(pick);
      }, delay);
    },
    [onAnswer, reducedMotion],
  );

  const chipWidth = Math.floor((width - 40 - 20) / 3);

  function chipState(option: SpeciesId): ChipState {
    if (picked === null) {
      return 'idle';
    }
    if (option === species && option === picked) {
      return 'correct';
    }
    if (option === picked) {
      return 'wrong';
    }
    return 'idle';
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.scrim} pointerEvents="none" />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.card, { width, transform: [{ scale }] }]}>
        <View pointerEvents="none" style={styles.innerLight} />
        <Text style={styles.caption}>WHOSE TRACK IS THIS?</Text>
        <View style={styles.printWrap}>
          <PawPrint species={species} size={84} />
        </View>
        <View style={styles.chips}>
          {options.map(option => (
            <SpeciesChip
              key={`opt-${option}`}
              species={option}
              state={chipState(option)}
              width={chipWidth}
              reducedMotion={reducedMotion}
              onPress={handlePick}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME.colors.ui.boardScrim,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,194,71,0.35)',
    backgroundColor: THEME.colors.bg.raised,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    overflow: 'hidden',
    ...THEME.shadows.clayDeep,
  },
  innerLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: THEME.colors.ui.innerLight,
  },
  caption: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: THEME.colors.text.secondary,
  },
  printWrap: {
    marginTop: 10,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

export default MatchCard;
