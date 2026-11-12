import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Compass } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ClaySurface from '../components/ClaySurface';
import EmptyNote from '../components/EmptyNote';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import StarRow from '../components/StarRow';
import { StatRow } from '../components/StatCard';
import {
  formatNumber,
  STREAK_MULTIPLIERS,
  TRAILS,
} from '../constants/config';
import THEME from '../constants/theme';
import { Profile } from '../game/storage';

type Props = {
  profile: Profile;
  onMenu: () => void;
  onPlay: () => void;
};

export function ProgressScreen({ profile, onMenu, onPlay }: Props) {
  const reducedMotion = profile.settings.reducedMotion;
  const accuracy =
    profile.answers > 0
      ? Math.round((profile.correctAnswers / profile.answers) * 100)
      : 0;
  const bestStreak = STREAK_MULTIPLIERS[profile.bestStreakStep] || 1;
  const efficiency =
    profile.expeditions > 0
      ? Math.max(0, Math.min(1, profile.finishedInTime / profile.expeditions))
      : 0;

  const empty = profile.expeditions === 0;

  return (
    <AppShell variant="panel">
      <View style={styles.root}>
        <ScreenHeader
          title="EXPEDITION LOG"
          onMenu={onMenu}
          reducedMotion={reducedMotion}
        />

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}>
          {empty ? (
            <ClaySurface tone="sheet" radius={26} style={styles.emptyCard}>
              <EmptyNote text="NO EXPEDITIONS LOGGED YET">
                <PrimaryButton
                  label="PLAY NOW"
                  Icon={Compass}
                  onPress={onPlay}
                  reducedMotion={reducedMotion}
                />
              </EmptyNote>
            </ClaySurface>
          ) : (
            <View style={styles.bento}>
              <StatRow
                items={[
                  {
                    key: 'exp',
                    value: formatNumber(profile.expeditions),
                    label: 'EXPEDITIONS',
                    valueColor: THEME.colors.green,
                  },
                  {
                    key: 'tracks',
                    value: formatNumber(profile.tracksFound),
                    label: 'TRACKS READ',
                    valueColor: THEME.colors.gold,
                  },
                ]}
              />
              <StatRow
                style={styles.secondRow}
                items={[
                  {
                    key: 'acc',
                    value: accuracy > 0 ? `${accuracy}%` : '',
                    label: 'ACCURACY',
                    valueColor: THEME.colors.green,
                  },
                  {
                    key: 'streak',
                    value: `x${bestStreak}`,
                    label: 'BEST STREAK',
                    valueColor: THEME.colors.orange,
                  },
                ]}
              />
            </View>
          )}

          <Text style={styles.sectionTitle}>TRAIL RECORDS</Text>
          <ClaySurface tone="sheet" radius={26} style={styles.list}>
            {TRAILS.map(trail => {
              const locked = trail.index >= profile.unlockedTrails;
              return (
                <View key={trail.id} style={styles.listRow}>
                  <Text
                    numberOfLines={1}
                    style={[styles.rowName, locked ? styles.rowLocked : null]}>
                    {`${trail.id}  ${trail.name}`}
                  </Text>
                  {locked ? (
                    <Text style={styles.rowLockedTag}>— LOCKED —</Text>
                  ) : (
                    <View style={styles.rowRight}>
                      <StarRow earned={profile.stars[trail.index] || 0} size={14} />
                      <Text style={styles.rowScore}>
                        {formatNumber(profile.trailBest[trail.index] || 0)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ClaySurface>

          <Text style={styles.sectionTitle}>DAYLIGHT EFFICIENCY</Text>
          <ClaySurface tone="sheet" radius={26} style={styles.efficiency}>
            <Text style={styles.efficiencyLabel}>
              {`FINISHED IN TIME ${profile.finishedInTime} / ${profile.expeditions}`}
            </Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${Math.round(efficiency * 100)}%` },
                ]}
              />
            </View>
          </ClaySurface>
        </ScrollView>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  emptyCard: {
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  bento: {
    width: '100%',
  },
  secondRow: {
    marginTop: 10,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.colors.text.muted,
  },
  list: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rowName: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: THEME.colors.text.primary,
  },
  rowLocked: {
    color: THEME.colors.text.disabled,
  },
  rowLockedTag: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: THEME.colors.text.disabled,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowScore: {
    minWidth: 56,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    color: THEME.colors.gold,
    fontVariant: ['tabular-nums'],
  },
  efficiency: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  efficiencyLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: THEME.colors.text.secondary,
    marginBottom: 10,
  },
  barTrack: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  barFill: {
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.green,
  },
});

export default ProgressScreen;
