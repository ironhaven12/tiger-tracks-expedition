import React, { useCallback } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SPRITES } from '../assets';
import { SpeciesId } from '../constants/config';
import { CARD_W } from '../constants/layout';
import THEME from '../constants/theme';
import { Species } from '../game/species';
import usePressScale from '../hooks/usePressScale';
import PawPrint from './PawPrint';

type Props = {
  species: Species;
  matched: number;
  unlocked: boolean;
  expanded: boolean;
  reducedMotion: boolean;
  onPress: (id: SpeciesId) => void;
};

export function SpeciesDossier({
  species,
  matched,
  unlocked,
  expanded,
  reducedMotion,
  onPress,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(!reducedMotion);

  const handlePress = useCallback(() => {
    onPress(species.id);
  }, [onPress, species.id]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={unlocked ? species.name : 'LOCKED SPECIES'}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, expanded ? styles.pressWide : null]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          expanded ? styles.cardWide : null,
          unlocked ? null : styles.cardLocked,
          { transform: [{ scale }] },
        ]}>
        <View pointerEvents="none" style={styles.innerLight} />
        <Image
          source={SPRITES[species.spriteIndex]}
          resizeMode="contain"
          style={[styles.sprite, unlocked ? null : styles.spriteLocked]}
        />
        <Text numberOfLines={1} style={styles.name}>
          {unlocked ? species.name : '? ? ?'}
        </Text>
        {unlocked ? (
          <View style={styles.printRow}>
            <PawPrint species={species.id} size={28} />
            <Text style={styles.matched}>{`MATCHED ${matched}x`}</Text>
          </View>
        ) : (
          <Text style={styles.lockedCaption}>MATCH 3 TRACKS TO UNLOCK</Text>
        )}
        {expanded && unlocked ? (
          <View style={styles.detail}>
            <Text style={styles.note}>{`${species.name} — ${species.note}`}</Text>
            <Text style={styles.habitat}>{species.habitat}</Text>
            <Text style={styles.close}>TAP TO CLOSE</Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: CARD_W,
    height: 176,
  },
  pressWide: {
    width: CARD_W * 2 + 14,
    height: 236,
  },
  card: {
    width: CARD_W,
    height: 176,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(0,230,118,0.22)',
    backgroundColor: THEME.colors.bg.raised,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    overflow: 'hidden',
    ...THEME.shadows.clay,
  },
  cardWide: {
    width: CARD_W * 2 + 14,
    height: 236,
  },
  cardLocked: {
    backgroundColor: '#13251C',
    borderColor: 'rgba(255,255,255,0.07)',
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
    width: 76,
    height: 76,
  },
  spriteLocked: {
    tintColor: '#24402F',
  },
  name: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1,
    color: THEME.colors.text.primary,
  },
  printRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matched: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: THEME.colors.gold,
  },
  lockedCaption: {
    marginTop: 8,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: THEME.colors.text.disabled,
    textAlign: 'center',
  },
  detail: {
    marginTop: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  note: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  habitat: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: THEME.colors.text.muted,
    textAlign: 'center',
  },
  close: {
    marginTop: 8,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: THEME.colors.green,
  },
});

export default SpeciesDossier;
