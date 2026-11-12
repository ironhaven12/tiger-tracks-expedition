import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import {
  BookOpen,
  Compass,
  Layers,
  Settings as SettingsIcon,
  TrendingUp,
} from 'lucide-react-native';
import assets from '../assets';
import AppShell from '../components/AppShell';
import EmptyNote from '../components/EmptyNote';
import { PawDecor } from '../components/PawPrint';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { StarGlyph } from '../components/StarRow';
import { StatRow } from '../components/StatCard';
import {
  formatNumber,
  MASTERY_THRESHOLD,
  TOTAL_STARS,
} from '../constants/config';
import { HEADER_TOP } from '../constants/layout';
import THEME from '../constants/theme';
import { SPECIES } from '../game/species';
import { Profile, unlockedSpecies } from '../game/storage';

type Props = {
  profile: Profile;
  onPlay: () => void;
  onLevels: () => void;
  onCollection: () => void;
  onProgress: () => void;
  onSettings: () => void;
};

export function MenuScreen({
  profile,
  onPlay,
  onLevels,
  onCollection,
  onProgress,
  onSettings,
}: Props) {
  const reducedMotion = profile.settings.reducedMotion;
  const sheetY = useRef(new Animated.Value(reducedMotion ? 0 : 36)).current;
  const float = useRef(new Animated.Value(0)).current;
  const rowOpacity = useRef([
    new Animated.Value(reducedMotion ? 1 : 0),
    new Animated.Value(reducedMotion ? 1 : 0),
  ]).current;

  useEffect(() => {
    if (reducedMotion) {
      sheetY.setValue(0);
      rowOpacity.forEach(v => v.setValue(1));
      float.setValue(0);
      return;
    }

    Animated.spring(sheetY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 9,
    }).start();

    rowOpacity.forEach((value, i) => {
      Animated.sequence([
        Animated.delay(120 + i * 60),
        Animated.timing(value, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1300,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [float, reducedMotion, rowOpacity, sheetY]);

  const stars = profile.stars.reduce((sum, value) => sum + value, 0);
  const species = unlockedSpecies(profile, MASTERY_THRESHOLD).length;
  const hasRecords = profile.expeditions > 0 && profile.bestScore > 0;

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 6],
  });

  return (
    <AppShell variant="menu">
      <View style={styles.root}>
        <View style={styles.topBar}>
          <View style={styles.starBadge}>
            <StarGlyph size={20} color={THEME.colors.gold} />
            <Text style={styles.starText}>{`${stars} / ${TOTAL_STARS}`}</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View pointerEvents="none" style={styles.pawLeft}>
            <PawDecor size={96} rotation={-18} opacity={0.12} />
          </View>
          <View pointerEvents="none" style={styles.pawRight}>
            <PawDecor size={64} rotation={24} opacity={0.1} />
          </View>
          <Animated.View pointerEvents="none" style={{ transform: [{ translateY }] }}>
            <Image source={assets.logo} resizeMode="contain" style={styles.logo} />
          </Animated.View>
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
          <View pointerEvents="none" style={styles.innerLight} />

          <Text style={styles.title}>TIGER TRACKS</Text>
          <Text style={styles.subtitle}>EXPEDITION</Text>
          <Text style={styles.tagline}>SWEEP THE THICKET - READ THE PRINTS</Text>

          {hasRecords ? (
            <StatRow
              style={styles.stats}
              items={[
                {
                  key: 'species',
                  value: `${species}/${SPECIES.length}`,
                  label: 'SPECIES',
                  valueColor: THEME.colors.green,
                },
                {
                  key: 'best',
                  value: formatNumber(profile.bestScore),
                  label: 'BEST SCORE',
                  valueColor: THEME.colors.gold,
                },
              ]}
            />
          ) : (
            <EmptyNote
              style={styles.stats}
              text="FIRST EXPEDITION - NO RECORDS YET"
            />
          )}

          <PrimaryButton
            label="START EXPEDITION"
            Icon={Compass}
            onPress={onPlay}
            reducedMotion={reducedMotion}
            style={styles.cta}
          />

          <Animated.View
            pointerEvents="box-none"
            style={[styles.row, { opacity: rowOpacity[0] }]}>
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
                label="COLLECTION"
                Icon={BookOpen}
                onPress={onCollection}
                reducedMotion={reducedMotion}
              />
            </View>
          </Animated.View>

          <Animated.View
            pointerEvents="box-none"
            style={[styles.row, { opacity: rowOpacity[1] }]}>
            <View style={styles.slot}>
              <SecondaryButton
                label="PROGRESS"
                Icon={TrendingUp}
                onPress={onProgress}
                reducedMotion={reducedMotion}
              />
            </View>
            <View style={styles.slot}>
              <SecondaryButton
                label="SETTINGS"
                Icon={SettingsIcon}
                onPress={onSettings}
                reducedMotion={reducedMotion}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    paddingTop: HEADER_TOP,
    height: HEADER_TOP + 28,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  starBadge: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(10,31,20,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,194,71,0.35)',
  },
  starText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: THEME.colors.gold,
    fontVariant: ['tabular-nums'],
  },
  hero: {
    flex: 1,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawLeft: {
    position: 'absolute',
    left: 26,
    top: 20,
  },
  pawRight: {
    position: 'absolute',
    right: 34,
    bottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
  },
  sheet: {
    borderTopLeftRadius: THEME.radius.sheet,
    borderTopRightRadius: THEME.radius.sheet,
    backgroundColor: THEME.colors.bg.sheet,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 14,
  },
  innerLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: 2,
    color: THEME.colors.text.primary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 6,
    color: THEME.colors.gold,
  },
  tagline: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: THEME.colors.text.secondary,
  },
  stats: {
    marginTop: 14,
    marginBottom: 16,
  },
  cta: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  slot: {
    flex: 1,
  },
});

export default MenuScreen;
