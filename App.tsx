/**
 * Tiger Tracks Expedition — screen state machine.
 * Conditional rendering only: no navigation library anywhere in the project.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { MASTERY_THRESHOLD, Settings, SpeciesId, TRAILS } from './src/constants/config';
import THEME from './src/constants/theme';
import { applyRun, Profile } from './src/game/storage';
import useProfile from './src/hooks/useProfile';
import CollectionScreen from './src/screens/CollectionScreen';
import GameScreen, { RunSummary } from './src/screens/GameScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ResultScreen from './src/screens/ResultScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type Screen =
  | 'loader'
  | 'menu'
  | 'levels'
  | 'game'
  | 'result'
  | 'gameover'
  | 'collection'
  | 'progress'
  | 'settings';

function App(): React.JSX.Element {
  const { profile, persist, updateSettings, reset } = useProfile();
  const [screen, setScreen] = useState<Screen>('loader');
  const [trailIndex, setTrailIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [newSpecies, setNewSpecies] = useState<SpeciesId | null>(null);

  const profileRef = useRef<Profile>(profile);
  profileRef.current = profile;

  const fade = useRef(new Animated.Value(1)).current;

  // Screen changes cross-fade instead of snapping.
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: profile.settings.reducedMotion ? 100 : 240,
      useNativeDriver: true,
    }).start();
  }, [screen, fade, profile.settings.reducedMotion]);

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goLevels = useCallback(() => setScreen('levels'), []);
  const goCollection = useCallback(() => setScreen('collection'), []);
  const goProgress = useCallback(() => setScreen('progress'), []);
  const goSettings = useCallback(() => setScreen('settings'), []);

  const startTrail = useCallback((index: number) => {
    const safe = Math.max(0, Math.min(TRAILS.length - 1, index));
    setTrailIndex(safe);
    setAttempt(prev => prev + 1);
    setScreen('game');
  }, []);

  const handlePlay = useCallback(() => {
    const next = Math.min(
      TRAILS.length - 1,
      Math.max(0, profileRef.current.unlockedTrails - 1),
    );
    startTrail(next);
  }, [startTrail]);

  const handleGameOver = useCallback(
    (run: RunSummary) => {
      const before = profileRef.current;
      const merged = applyRun(before, {
        trailIndex: run.trailIndex,
        outcome: run.outcome,
        stars: run.stars,
        total: run.breakdown.total,
        matched: run.matched as Partial<Record<SpeciesId, number>>,
        tracksFound: run.tracksFound,
        answers: run.answers,
        correctAnswers: run.correctAnswers,
        bestStreakStep: run.bestStreakStep,
        daylightLeft: run.daylightLeft,
      });

      let unlocked: SpeciesId | null = null;
      (Object.keys(run.matched) as SpeciesId[]).forEach(id => {
        const was = before.matched[id] || 0;
        const now = merged.matched[id] || 0;
        if (was < MASTERY_THRESHOLD && now >= MASTERY_THRESHOLD) {
          unlocked = id;
        }
      });

      setIsNewBest(run.breakdown.total > before.bestScore && run.breakdown.total > 0);
      setNewSpecies(unlocked);
      setSummary(run);
      persist(merged);
      setScreen('gameover');
    },
    [persist],
  );

  const handlePlayAgain = useCallback(() => {
    startTrail(trailIndex);
  }, [startTrail, trailIndex]);

  const handleNextTrail = useCallback(() => {
    startTrail(Math.min(TRAILS.length - 1, trailIndex + 1));
  }, [startTrail, trailIndex]);

  const handleSettings = useCallback(
    (patch: Partial<Settings>) => {
      updateSettings(patch);
    },
    [updateSettings],
  );

  // System Back: forward screens return to Menu, Menu closes the app.
  useEffect(() => {
    const onBack = () => {
      if (screen === 'loader') {
        return true;
      }
      if (screen === 'menu') {
        return false;
      }
      setScreen('menu');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [screen]);

  const trail = TRAILS[trailIndex] || TRAILS[0];

  function renderScreen() {
    switch (screen) {
      case 'loader':
        return <LoaderScreen onDone={goMenu} />;

      case 'levels':
        return (
          <LevelSelectScreen
            profile={profile}
            selected={trailIndex}
            onSelect={setTrailIndex}
            onStart={startTrail}
            onMenu={goMenu}
          />
        );

      case 'game':
        return (
          <GameScreen
            trail={trail}
            settings={profile.settings}
            attempt={attempt}
            onGameOver={handleGameOver}
            onMenu={goMenu}
            onRestart={handlePlayAgain}
          />
        );

      case 'result':
      case 'gameover':
        if (!summary) {
          return (
            <MenuScreen
              profile={profile}
              onPlay={handlePlay}
              onLevels={goLevels}
              onCollection={goCollection}
              onProgress={goProgress}
              onSettings={goSettings}
            />
          );
        }
        return (
          <ResultScreen
            summary={summary}
            trail={TRAILS[summary.trailIndex] || trail}
            isNewBest={isNewBest}
            newSpecies={newSpecies}
            reducedMotion={profile.settings.reducedMotion}
            onPlayAgain={handlePlayAgain}
            onNextTrail={handleNextTrail}
            onLevels={goLevels}
            onMenu={goMenu}
          />
        );

      case 'collection':
        return <CollectionScreen profile={profile} onMenu={goMenu} />;

      case 'progress':
        return (
          <ProgressScreen
            profile={profile}
            onMenu={goMenu}
            onPlay={handlePlay}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            profile={profile}
            onChange={handleSettings}
            onReset={reset}
            onMenu={goMenu}
          />
        );

      case 'menu':
      default:
        return (
          <MenuScreen
            profile={profile}
            onPlay={handlePlay}
            onLevels={goLevels}
            onCollection={goCollection}
            onProgress={goProgress}
            onSettings={goSettings}
          />
        );
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, { opacity: fade }]}>
        {renderScreen()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.bg.deep,
  },
  fill: {
    flex: 1,
  },
});

export default App;
