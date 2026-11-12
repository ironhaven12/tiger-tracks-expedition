import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Home, RotateCcw } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ClaySurface from '../components/ClaySurface';
import OptionRow from '../components/OptionRow';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import {
  BOARD_TILE,
  BoardSizeId,
  daylightFor,
  PaceId,
  Settings,
  TRAILS,
} from '../constants/config';
import THEME from '../constants/theme';
import { Profile } from '../game/storage';

type Props = {
  profile: Profile;
  onChange: (patch: Partial<Settings>) => void;
  onReset: () => void;
  onMenu: () => void;
};

export function SettingsScreen({ profile, onChange, onReset, onMenu }: Props) {
  const settings = profile.settings;
  const reducedMotion = settings.reducedMotion;
  const [confirming, setConfirming] = useState(false);

  const setHints = useCallback(
    (value: string) => onChange({ hints: value === 'ON' }),
    [onChange],
  );
  const setPace = useCallback(
    (value: string) => onChange({ pace: value as PaceId }),
    [onChange],
  );
  const setBoard = useCallback(
    (value: string) => onChange({ boardSize: value as BoardSizeId }),
    [onChange],
  );
  const setMotion = useCallback(
    (value: string) => onChange({ reducedMotion: value === 'ON' }),
    [onChange],
  );

  const handleReset = useCallback(() => {
    setConfirming(false);
    onReset();
    onMenu();
  }, [onMenu, onReset]);

  const firstTrailSteps = daylightFor(TRAILS[0], settings.pace);

  return (
    <AppShell variant="panel">
      <View style={styles.root}>
        <ScreenHeader
          title="EXPEDITION KIT"
          onMenu={onMenu}
          reducedMotion={reducedMotion}
        />

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}>
          <OptionRow
            title="INSTINCT HINTS"
            caption={
              settings.hints
                ? 'ON - SWEPT CELLS SHOW HOW MANY TRACKS TOUCH THEM'
                : 'OFF - ONLY A DOT, AND THE TRAIL SCORE IS x1.25'
            }
            options={['ON', 'OFF']}
            value={settings.hints ? 'ON' : 'OFF'}
            reducedMotion={reducedMotion}
            onChange={setHints}
          />

          <OptionRow
            title="DAYLIGHT PACE"
            caption={`${settings.pace} - TRAIL 01 STARTS WITH ${firstTrailSteps} STEPS`}
            options={['RELAXED', 'STANDARD', 'EXPERT']}
            value={settings.pace}
            reducedMotion={reducedMotion}
            onChange={setPace}
          />

          <OptionRow
            title="BOARD SIZE"
            caption={`${settings.boardSize} - THICKET CELLS AT ${BOARD_TILE[settings.boardSize]} PX`}
            options={['COMFORT', 'COMPACT']}
            value={settings.boardSize}
            reducedMotion={reducedMotion}
            onChange={setBoard}
          />

          <OptionRow
            title="REDUCED MOTION"
            caption={
              settings.reducedMotion
                ? 'ON - IDLE LOOPS STOP AND EVERY ANIMATION IS SHORTENED'
                : 'OFF - FULL CLAY MOTION, IDLE LOOPS RUNNING'
            }
            options={['ON', 'OFF']}
            value={settings.reducedMotion ? 'ON' : 'OFF'}
            reducedMotion={reducedMotion}
            onChange={setMotion}
          />

          <ClaySurface tone="raised" radius={22} style={styles.resetCard}>
            <Text style={styles.resetTitle}>RESET EXPEDITION DATA</Text>
            <Text style={styles.resetCaption}>
              CLEARS STARS, RECORDS AND THE FIELD COLLECTION
            </Text>
            {confirming ? (
              <View style={styles.confirmRow}>
                <View style={styles.slot}>
                  <SecondaryButton
                    label="RESET"
                    Icon={RotateCcw}
                    tone="danger"
                    onPress={handleReset}
                    reducedMotion={reducedMotion}
                  />
                </View>
                <View style={styles.slot}>
                  <SecondaryButton
                    label="CANCEL"
                    Icon={Home}
                    onPress={() => setConfirming(false)}
                    reducedMotion={reducedMotion}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.confirmRow}>
                <View style={styles.slot}>
                  <SecondaryButton
                    label="RESET DATA"
                    Icon={RotateCcw}
                    tone="danger"
                    onPress={() => setConfirming(true)}
                    reducedMotion={reducedMotion}
                  />
                </View>
              </View>
            )}
          </ClaySurface>

          <Text style={styles.note}>
            EVERY OPTION IS SAVED AT ONCE AND APPLIES TO THE NEXT EXPEDITION
          </Text>
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
    gap: 12,
  },
  resetCard: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderColor: 'rgba(255,59,48,0.45)',
  },
  resetTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: THEME.colors.error,
  },
  resetCaption: {
    marginTop: 3,
    marginBottom: 12,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: THEME.colors.text.secondary,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slot: {
    flex: 1,
  },
  note: {
    marginTop: 6,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: THEME.colors.text.muted,
    textAlign: 'center',
  },
});

export default SettingsScreen;
