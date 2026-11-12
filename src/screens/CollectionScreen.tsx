import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import EmptyNote from '../components/EmptyNote';
import ScreenHeader from '../components/ScreenHeader';
import SpeciesDossier from '../components/SpeciesDossier';
import { MASTERY_THRESHOLD, SpeciesId } from '../constants/config';
import { GRID_W } from '../constants/layout';
import THEME from '../constants/theme';
import { SPECIES } from '../game/species';
import { Profile } from '../game/storage';

type Props = {
  profile: Profile;
  onMenu: () => void;
};

export function CollectionScreen({ profile, onMenu }: Props) {
  const reducedMotion = profile.settings.reducedMotion;
  const [expanded, setExpanded] = useState<SpeciesId | null>(null);

  const handlePress = useCallback((id: SpeciesId) => {
    setExpanded(prev => (prev === id ? null : id));
  }, []);

  const unlockedCount = SPECIES.filter(
    s => (profile.matched[s.id] || 0) >= MASTERY_THRESHOLD,
  ).length;

  return (
    <AppShell variant="panel">
      <View style={styles.root}>
        <ScreenHeader
          title="FIELD COLLECTION"
          onMenu={onMenu}
          reducedMotion={reducedMotion}
          rightSlot={
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {`${unlockedCount} / ${SPECIES.length}`}
              </Text>
            </View>
          }
        />

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}>
          {unlockedCount === 0 ? (
            <EmptyNote text="NO SPECIES IDENTIFIED YET - START AN EXPEDITION" />
          ) : (
            <Text style={styles.lead}>
              {`${unlockedCount} DOSSIER${unlockedCount === 1 ? '' : 'S'} OPEN - TAP A CARD FOR THE FIELD NOTE`}
            </Text>
          )}

          <View style={styles.grid}>
            {SPECIES.map(species => {
              const matched = profile.matched[species.id] || 0;
              return (
                <SpeciesDossier
                  key={species.id}
                  species={species}
                  matched={matched}
                  unlocked={matched >= MASTERY_THRESHOLD}
                  expanded={expanded === species.id}
                  reducedMotion={reducedMotion}
                  onPress={handlePress}
                />
              );
            })}
          </View>

          <Text style={styles.footnote}>
            {`MATCH ONE ANIMAL ${MASTERY_THRESHOLD} TIMES TO OPEN ITS DOSSIER`}
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
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,31,20,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(0,230,118,0.35)',
  },
  chipText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    color: THEME.colors.green,
    fontVariant: ['tabular-nums'],
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 28,
  },
  lead: {
    width: GRID_W,
    marginBottom: 12,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  grid: {
    width: GRID_W,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 14,
  },
  footnote: {
    marginTop: 16,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: THEME.colors.text.muted,
    textAlign: 'center',
  },
});

export default CollectionScreen;
