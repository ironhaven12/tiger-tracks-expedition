import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import AppShell from '../components/AppShell';
import DaylightMeter from '../components/DaylightMeter';
import FloatingControlBar from '../components/FloatingControlBar';
import HintPill from '../components/HintPill';
import MatchCard from '../components/MatchCard';
import PauseOverlay from '../components/PauseOverlay';
import RoundIconButton from '../components/RoundIconButton';
import RouteMapStrip from '../components/RouteMapStrip';
import ScreenHeader from '../components/ScreenHeader';
import TrackBoard from '../components/TrackBoard';
import {
  BOARD_TILE,
  Settings,
  STREAK_MULTIPLIERS,
  TrailConfig,
} from '../constants/config';
import {
  boardWidth,
  CONTROL_BAR_BOTTOM,
  CONTROL_BAR_H,
  tileSize,
} from '../constants/layout';
import THEME from '../constants/theme';
import { summarize } from '../game/gameReducer';
import useGameEngine from '../hooks/useGameEngine';

export type RunSummary = ReturnType<typeof summarize> & {
  trailIndex: number;
  matched: Record<string, number>;
  tracksFound: number;
  answers: number;
  correctAnswers: number;
  bestStreakStep: number;
  daylightLeft: number;
  daylightTotal: number;
  mistakes: number;
};

type Props = {
  trail: TrailConfig;
  settings: Settings;
  attempt: number;
  onGameOver: (summary: RunSummary) => void;
  onMenu: () => void;
  onRestart: () => void;
};

export function GameScreen({
  trail,
  settings,
  attempt,
  onGameOver,
  onMenu,
  onRestart,
}: Props) {
  const { state, sweep, answer, scan } = useGameEngine(trail, settings, attempt);
  const reducedMotion = settings.reducedMotion;
  const [paused, setPaused] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const firstRun = useRef(true);
  const boardFade = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const gain = useRef(new Animated.Value(0)).current;
  const finished = useRef(false);

  const tile = tileSize(BOARD_TILE[settings.boardSize]);
  const bWidth = boardWidth(tile);

  useEffect(() => {
    finished.current = false;
    if (reducedMotion) {
      boardFade.setValue(1);
      return;
    }
    boardFade.setValue(0);
    Animated.timing(boardFade, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [boardFade, reducedMotion, trail, attempt]);

  // Controls hint: on for the first 6 s, back after 5 s of an idle board.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      const first = setTimeout(() => setHintVisible(false), 6000);
      return () => clearTimeout(first);
    }
    setHintVisible(false);
    const back = setTimeout(() => setHintVisible(true), 5000);
    return () => clearTimeout(back);
  }, [state.feedbackAt]);

  // Floating "+N" after a correct match.
  useEffect(() => {
    if (state.feedback !== 'correct' || state.lastGain <= 0) {
      return;
    }
    gain.setValue(0);
    Animated.timing(gain, {
      toValue: 1,
      duration: reducedMotion ? 200 : 520,
      useNativeDriver: true,
    }).start();
  }, [state.feedback, state.feedbackAt, state.lastGain, gain, reducedMotion]);

  // The round ends -> a short beat, then the result screen.
  useEffect(() => {
    if (state.outcome === null || finished.current) {
      return;
    }
    finished.current = true;
    const summary = summarize(state);
    const timer = setTimeout(() => {
      onGameOver({
        ...summary,
        trailIndex: trail.index,
        matched: state.matched as Record<string, number>,
        tracksFound: state.correctAnswers,
        answers: state.answers,
        correctAnswers: state.correctAnswers,
        bestStreakStep: state.bestStreakStep,
        daylightLeft: Math.max(0, state.daylight),
        daylightTotal: state.daylightTotal,
        mistakes: state.mistakes,
      });
    }, reducedMotion ? 220 : 600);
    return () => clearTimeout(timer);
  }, [state, onGameOver, trail.index, reducedMotion]);

  const handlePause = useCallback(() => setPaused(true), []);
  const handleResume = useCallback(() => setPaused(false), []);
  const handleRestart = useCallback(() => {
    setPaused(false);
    onRestart();
  }, [onRestart]);

  const streak = STREAK_MULTIPLIERS[state.streakStep];

  return (
    <AppShell variant="board">
      <View style={styles.root}>
        <ScreenHeader
          title={trail.name}
          subtitle={`TRACKS ${state.routeIndex} / ${state.routeLength}`}
          reducedMotion={reducedMotion}
          leftSlot={
            <RoundIconButton
              source={assets.iconPause}
              label="PAUSE"
              onPress={handlePause}
              reducedMotion={reducedMotion}
            />
          }
          rightSlot={
            <DaylightMeter
              left={state.daylight}
              total={state.daylightTotal}
              reducedMotion={reducedMotion}
            />
          }
        />

        <RouteMapStrip
          total={state.routeLength}
          reached={state.routeIndex}
          reducedMotion={reducedMotion}
        />

        <HintPill text="TAP A THICKET TO SWEEP IT" visible={hintVisible} />

        <View style={styles.boardArea}>
          <Animated.View
            pointerEvents="box-none"
            style={[styles.boardWrap, { opacity: boardFade }]}>
            <TrackBoard
              cells={state.cells}
              revealed={state.revealed}
              scanned={state.scanned}
              tile={tile}
              hintsOn={state.hintsOn}
              reducedMotion={reducedMotion}
              onSweep={sweep}
            />
          </Animated.View>

          {state.lastGain > 0 && state.feedback === 'correct' ? (
            <Animated.Text

              style={[
                styles.gain,
                {
                  opacity: gain.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [0, 1, 0],
                  }),
                  transform: [
                    {
                      translateY: gain.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -28],
                      }),
                    },
                  ],
                },
              ]}>
              {`+${state.lastGain}`}
            </Animated.Text>
          ) : null}

          {state.phase === 'matching' && state.pending ? (
            <MatchCard
              species={state.pending.species}
              options={state.pending.options}
              width={bWidth - 24}
              reducedMotion={reducedMotion}
              onAnswer={answer}
            />
          ) : null}
        </View>

        <FloatingControlBar
          streak={streak}
          found={state.routeIndex}
          total={state.routeLength}
          scansLeft={state.scansLeft}
          reducedMotion={reducedMotion}
          onScan={scan}
        />

        {state.outcome !== null ? (
          <View pointerEvents="none" style={styles.endVeil}>
            <Text
              style={[
                styles.endText,
                state.outcome === 'win' ? styles.endWin : styles.endLose,
              ]}>
              {state.outcome === 'win' ? 'TRAIL COMPLETE' : 'THE TRACKS WENT COLD'}
            </Text>
          </View>
        ) : null}

        {paused ? (
          <PauseOverlay
            trailName={trail.name}
            found={state.routeIndex}
            total={state.routeLength}
            daylight={Math.max(0, state.daylight)}
            score={state.runScore}
            reducedMotion={reducedMotion}
            onResume={handleResume}
            onRestart={handleRestart}
            onMenu={onMenu}
          />
        ) : null}
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: CONTROL_BAR_H + CONTROL_BAR_BOTTOM,
  },
  boardWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gain: {
    position: 'absolute',
    top: 24,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    color: THEME.colors.green,
  },
  endVeil: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5,15,10,0.55)',
  },
  endText: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  endWin: {
    color: THEME.colors.green,
  },
  endLose: {
    color: THEME.colors.orangeLight,
  },
});

export default GameScreen;
