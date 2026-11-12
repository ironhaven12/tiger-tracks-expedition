import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Home, Play, RotateCcw } from 'lucide-react-native';
import THEME from '../constants/theme';
import ClaySurface from './ClaySurface';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from './PrimaryButton';

type Props = {
  trailName: string;
  found: number;
  total: number;
  daylight: number;
  score: number;
  reducedMotion: boolean;
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
};

export function PauseOverlay({
  trailName,
  found,
  total,
  daylight,
  score,
  reducedMotion,
  onResume,
  onRestart,
  onMenu,
}: Props) {
  return (
    <View style={styles.overlay}>
      <ClaySurface tone="sheet" radius={30} deep style={styles.panel}>
        <Text style={styles.title}>PAUSED</Text>
        <Text style={styles.trail}>{trailName}</Text>

        <View style={styles.statsRow}>
          <Stat label="TRACKS" value={`${found}/${total}`} color={THEME.colors.green} />
          <Stat label="DAYLIGHT" value={String(daylight)} color={THEME.colors.gold} />
          <Stat label="SCORE" value={String(score)} color={THEME.colors.orange} />
        </View>

        <PrimaryButton
          label="RESUME"
          Icon={Play}
          onPress={onResume}
          reducedMotion={reducedMotion}
          style={styles.cta}
        />
        <View style={styles.row}>
          <View style={styles.slot}>
            <SecondaryButton
              label="RESTART"
              Icon={RotateCcw}
              onPress={onRestart}
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
      </ClaySurface>
    </View>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME.colors.ui.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  panel: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 22,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: 3,
    color: THEME.colors.text.primary,
  },
  trail: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.colors.gold,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 18,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: THEME.colors.text.secondary,
  },
  cta: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  slot: {
    flex: 1,
  },
});

export default PauseOverlay;
