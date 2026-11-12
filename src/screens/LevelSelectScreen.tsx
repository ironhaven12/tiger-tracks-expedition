import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Compass } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import LevelCard from '../components/LevelCard';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { StarGlyph } from '../components/StarRow';
import { TOTAL_STARS, TRAILS } from '../constants/config';
import { GRID_W } from '../constants/layout';
import THEME from '../constants/theme';
import { Profile } from '../game/storage';

type Props = {
  profile: Profile;
  selected: number;
  onSelect: (index: number) => void;
  onStart: (index: number) => void;
  onMenu: () => void;
};

export function LevelSelectScreen({
  profile,
  selected,
  onSelect,
  onStart,
  onMenu,
}: Props) {
  const reducedMotion = profile.settings.reducedMotion;
  const [blocked, setBlocked] = useState<string>('');

  const handleCard = useCallback(
    (index: number) => {
      if (index >= profile.unlockedTrails) {
        setBlocked('COMPLETE THE PREVIOUS TRAIL FIRST');
        return;
      }
      setBlocked('');
      onSelect(index);
    },
    [onSelect, profile.unlockedTrails],
  );

  const handleStart = useCallback(() => {
    onStart(selected);
  }, [onStart, selected]);

  const stars = profile.stars.reduce((sum, value) => sum + value, 0);
  const trail = TRAILS[selected] || TRAILS[0];

  return (
    <AppShell variant="panel">
      <View style={styles.root}>
        <ScreenHeader
          title="EXPEDITION TRAILS"
          onMenu={onMenu}
          reducedMotion={reducedMotion}
          rightSlot={
            <View style={styles.starBadge}>
              <StarGlyph size={16} color={THEME.colors.gold} />
              <Text style={styles.starText}>{`${stars}/${TOTAL_STARS}`}</Text>
            </View>
          }
        />

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {TRAILS.map(item => (
              <LevelCard
                key={item.id}
                trail={item}
                stars={profile.stars[item.index] || 0}
                locked={item.index >= profile.unlockedTrails}
                selected={item.index === selected}
                reducedMotion={reducedMotion}
                onPress={handleCard}
              />
            ))}
          </View>
          {blocked ? <Text style={styles.blocked}>{blocked}</Text> : null}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerHint}>
            {`SELECTED - ${trail.name} - ${trail.tracksTotal} TRACKS`}
          </Text>
          <PrimaryButton
            label="START EXPEDITION"
            Icon={Compass}
            onPress={handleStart}
            reducedMotion={reducedMotion}
          />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  starBadge: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10,31,20,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,194,71,0.35)',
  },
  starText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    color: THEME.colors.gold,
    fontVariant: ['tabular-nums'],
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 12,
  },
  grid: {
    width: GRID_W,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  blocked: {
    marginTop: 14,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: THEME.colors.orangeLight,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  footerHint: {
    marginBottom: 12,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
});

export default LevelSelectScreen;
