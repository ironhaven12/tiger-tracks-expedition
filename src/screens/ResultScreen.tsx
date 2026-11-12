import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Compass, Home, Layers, RotateCcw } from 'lucide-react-native';
import { SPRITES } from '../assets';
import AppShell from '../components/AppShell';
import ClaySurface from '../components/ClaySurface';
import { PawDecor } from '../components/PawPrint';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { StarGlyph } from '../components/StarRow';
import {
  formatNumber,
  SpeciesId,
  TRAILS,
  TrailConfig,
} from '../constants/config';
import THEME from '../constants/theme';
import { getSpecies } from '../game/species';
import { outcomeSubtitle, outcomeTitle } from '../game/scoring';
import { RunSummary } from './GameScreen';

type Props = {
  summary: RunSummary;
  trail: TrailConfig;
  isNewBest: boolean;
  newSpecies: SpeciesId | null;
  reducedMotion: boolean;
  onPlayAgain: () => void;
  onNextTrail: () => void;
  onLevels: () => void;
  onMenu: () => void;
};

const TITLE_COLOR = {
  win: THEME.colors.green,
  daylight: THEME.colors.orangeLight,
  lost: THEME.colors.orange,
};

export function ResultScreen({
  summary,
  trail,
  isNewBest,
  newSpecies,
  reducedMotion,
  onPlayAgain,
  onNextTrail,
  onLevels,
  onMenu,
}: Props) {
  const { outcome, breakdown, stars } = summary;
  const starScales = useRef(
    [0, 1, 2].map(() => new Animated.Value(reducedMotion ? 1 : 0.4)),
  ).current;
  const counter = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState(reducedMotion ? breakdown.total : 0);

  useEffect(() => {
    if (reducedMotion) {
      starScales.forEach(v => v.setValue(1));
      setShown(breakdown.total);
      return;
    }

    starScales.forEach((value, i) => {
      value.setValue(i < stars ? 0.4 : 1);
      if (i < stars) {
        Animated.sequence([
          Animated.delay(180 * i),
          Animated.spring(value, {
            toValue: 1,
            useNativeDriver: true,
            tension: THEME.animation.snappy.tension,
            friction: THEME.animation.snappy.friction,
          }),
        ]).start();
      }
    });

    counter.setValue(0);
    const id = counter.addListener(({ value }) => {
      setShown(Math.round(value * breakdown.total));
    });
    Animated.timing(counter, {
      toValue: 1,
      duration: 900,
      useNativeDriver: false,
    }).start();

    return () => {
      counter.removeListener(id);
    };
  }, [breakdown.total, counter, reducedMotion, starScales, stars]);

  const won = outcome === 'win';
  const hasNext = won && trail.index + 1 < TRAILS.length;
  const species = newSpecies ? getSpecies(newSpecies) : null;

  return (
    <AppShell variant={won ? 'win' : 'lose'}>
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.decor} pointerEvents="none">
          <PawDecor
            size={56}
            rotation={-14}
            opacity={0.18}
            color={won ? THEME.colors.green : THEME.colors.orange}
          />
        </View>

        <Text style={[styles.title, { color: TITLE_COLOR[outcome] }]}>
          {outcomeTitle(outcome)}
        </Text>
        <Text style={styles.subtitle}>{outcomeSubtitle(outcome)}</Text>
        <Text style={styles.trail}>{trail.name}</Text>

        <View style={styles.stars}>
          {[0, 1, 2].map(i => (
            <Animated.View
              pointerEvents="none"
              key={`rstar-${i}`}
              style={{ transform: [{ scale: starScales[i] }] }}>
              <StarGlyph
                size={44}
                color={i < stars ? THEME.colors.gold : 'rgba(255,255,255,0.12)'}
              />
            </Animated.View>
          ))}
        </View>

        <ClaySurface tone="sheet" radius={28} deep style={styles.panel}>
          {isNewBest ? (
            <View style={styles.ribbon} pointerEvents="none">
              <Text style={styles.ribbonText}>NEW BEST!</Text>
            </View>
          ) : null}

          <Row
            label={`TRACKS READ ${summary.correctAnswers}`}
            value={formatNumber(breakdown.matchPoints)}
          />
          {breakdown.daylightPoints > 0 ? (
            <Row
              label={`DAYLIGHT LEFT ${summary.daylightLeft} x 15`}
              value={formatNumber(breakdown.daylightPoints)}
            />
          ) : null}
          {breakdown.noMistakeBonus > 0 ? (
            <Row
              label="NO-MISTAKE BONUS"
              value={formatNumber(breakdown.noMistakeBonus)}
            />
          ) : null}
          <Row label={`MISTAKES ${summary.mistakes}`} value="" muted />

          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{formatNumber(shown)}</Text>
          </View>
        </ClaySurface>

        {species ? (
          <ClaySurface tone="raised" radius={22} style={styles.speciesCard}>
            <Image
              source={SPRITES[species.spriteIndex]}
              resizeMode="contain"
              style={styles.speciesSprite}
            />
            <View style={styles.speciesText}>
              <Text style={styles.speciesTitle}>
                {`NEW SPECIES: ${species.name}`}
              </Text>
              <Text style={styles.speciesNote}>{species.note}</Text>
            </View>
          </ClaySurface>
        ) : null}

        <View style={styles.actions}>
          {hasNext ? (
            <PrimaryButton
              label="NEXT TRAIL"
              Icon={Compass}
              onPress={onNextTrail}
              reducedMotion={reducedMotion}
              style={styles.cta}
            />
          ) : (
            <PrimaryButton
              label="PLAY AGAIN"
              Icon={RotateCcw}
              onPress={onPlayAgain}
              reducedMotion={reducedMotion}
              style={styles.cta}
            />
          )}

          {hasNext ? (
            <View style={styles.row}>
              <View style={styles.slot}>
                <SecondaryButton
                  label="PLAY AGAIN"
                  Icon={RotateCcw}
                  onPress={onPlayAgain}
                  reducedMotion={reducedMotion}
                />
              </View>
              <View style={styles.slot}>
                <SecondaryButton
                  label="LEVELS"
                  Icon={Layers}
                  onPress={onLevels}
                  reducedMotion={reducedMotion}
                />
              </View>
            </View>
          ) : (
            <View style={styles.row}>
              <View style={styles.slot}>
                <SecondaryButton
                  label="LEVELS"
                  Icon={Layers}
                  onPress={onLevels}
                  reducedMotion={reducedMotion}
                />
              </View>
              <View style={styles.slot}>
                <SecondaryButton
                  label="MENU"
                  Icon={Home}
                  onPress={onMenu}
                  reducedMotion={reducedMotion}
                />
              </View>
            </View>
          )}

          {hasNext ? (
            <View style={styles.rowSingle}>
              <SecondaryButton
                label="MENU"
                Icon={Home}
                onPress={onMenu}
                reducedMotion={reducedMotion}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </AppShell>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <View style={styles.panelRow}>
      <Text style={[styles.rowLabel, muted ? styles.rowMuted : null]}>
        {label}
      </Text>
      {value ? (
        <Text style={[styles.rowValue, muted ? styles.rowMuted : null]}>
          {value}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingTop: 64,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  decor: {
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 1.6,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  trail: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 2.4,
    color: THEME.colors.gold,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    marginBottom: 18,
  },
  panel: {
    width: '100%',
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 16,
  },
  ribbon: {
    position: 'absolute',
    top: 10,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: THEME.colors.orange,
    transform: [{ rotate: '-6deg' }],
  },
  ribbonText: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#1A1004',
  },
  panelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: THEME.colors.text.secondary,
  },
  rowValue: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    color: THEME.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  rowMuted: {
    color: THEME.colors.text.muted,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    letterSpacing: 2,
    color: THEME.colors.text.primary,
  },
  totalValue: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    color: THEME.colors.gold,
    fontVariant: ['tabular-nums'],
  },
  speciesCard: {
    width: '100%',
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  speciesSprite: {
    width: 44,
    height: 44,
  },
  speciesText: {
    flex: 1,
  },
  speciesTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1,
    color: THEME.colors.green,
  },
  speciesNote: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: THEME.colors.text.secondary,
  },
  actions: {
    width: '100%',
    marginTop: 18,
  },
  cta: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowSingle: {
    marginTop: 10,
  },
  slot: {
    flex: 1,
  },
});

export default ResultScreen;
