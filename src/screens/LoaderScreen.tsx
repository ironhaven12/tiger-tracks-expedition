import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import AppShell from '../components/AppShell';
import { PawDecor } from '../components/PawPrint';
import { LOADER_DURATION_MS } from '../constants/config';
import THEME from '../constants/theme';

type Props = {
  onDone: () => void;
};

const BAR_W = 212;
const FIREFLIES = [
  { top: 90, left: 40 },
  { top: 140, left: 300 },
  { top: 210, left: 120 },
  { top: 260, left: 250 },
  { top: 330, left: 60 },
  { top: 380, left: 330 },
  { top: 430, left: 180 },
  { top: 480, left: 90 },
  { top: 520, left: 280 },
  { top: 570, left: 150 },
  { top: 620, left: 330 },
  { top: 660, left: 50 },
];

const PAW_TRAIL = [
  { bottom: 96, left: 56, rotation: -24 },
  { bottom: 128, left: 122, rotation: -8 },
  { bottom: 120, left: 196, rotation: 12 },
  { bottom: 88, left: 266, rotation: 26 },
];

/**
 * Brand card only: no PLAY button, no stat chips, no tap handler. The screen
 * leaves on its own 8 s timer.
 */
export function LoaderScreen({ onDone }: Props) {
  const badgeScale = useRef(new Animated.Value(0.72)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(16)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const paws = useRef(PAW_TRAIL.map(() => new Animated.Value(0))).current;
  const done = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(badgeScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: THEME.animation.soft.tension,
        friction: THEME.animation.soft.friction,
      }),
      Animated.timing(badgeOpacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(260),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 380,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(420),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start();

    // width is a layout property -> the JS driver is mandatory here.
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS - 400,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    paws.forEach((paw, i) => {
      Animated.sequence([
        Animated.delay(1200 * (i + 1)),
        Animated.timing(paw, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start(() => {
        if (!done.current) {
          done.current = true;
          onDone();
        }
      });
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(timer);
      done.current = true;
    };
  }, [
    badgeOpacity,
    badgeScale,
    fade,
    onDone,
    paws,
    progress,
    subtitleOpacity,
    titleOpacity,
    titleY,
  ]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_W],
  });

  return (
    <AppShell variant="loader">
      <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: fade }]}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {FIREFLIES.map((spot, i) => (
            <View
              key={`fly-${i}`}
              style={[styles.firefly, { top: spot.top, left: spot.left }]}
            />
          ))}
        </View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.badge,
            {
              opacity: badgeOpacity,
              transform: [{ scale: badgeScale }],
            },
          ]}>
          <View pointerEvents="none" style={styles.innerLight} />
          <Image source={assets.logo} resizeMode="contain" style={styles.logo} />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}>
          <Text style={styles.title}>TIGER TRACKS</Text>
          <Text style={styles.subtitle}>EXPEDITION</Text>
        </Animated.View>

        <Animated.Text style={[styles.tagline, { opacity: subtitleOpacity }]}>
          FOLLOW THE WILD TRAIL
        </Animated.Text>

        <View style={styles.barTrack}>
          <Animated.View pointerEvents="none" style={[styles.barFill, { width: barWidth }]}>
            <LinearGradient
              colors={[...THEME.gradients.progress]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING...</Text>

        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {PAW_TRAIL.map((paw, i) => (
            <Animated.View
              pointerEvents="none"
              key={`paw-${i}`}
              style={[
                styles.paw,
                {
                  bottom: paw.bottom,
                  left: paw.left,
                  opacity: paws[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.18, 0.5],
                  }),
                },
              ]}>
              <PawDecor
                size={34}
                rotation={paw.rotation}
                color={THEME.colors.gold}
                opacity={1}
              />
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  firefly: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: THEME.colors.gold,
    opacity: 0.25,
  },
  badge: {
    width: 164,
    height: 164,
    borderRadius: 40,
    backgroundColor: THEME.colors.bg.raised,
    borderWidth: 2,
    borderColor: 'rgba(0,230,118,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 28,
    ...THEME.shadows.clayDeep,
  },
  innerLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: THEME.colors.ui.innerLight,
  },
  logo: {
    width: 116,
    height: 116,
  },
  title: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '900',
    letterSpacing: 3,
    color: '#F2FFF7',
    textAlign: 'center',
    textShadowColor: 'rgba(255,109,0,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: 7,
    color: THEME.colors.gold,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 18,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 2.5,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  barTrack: {
    marginTop: 30,
    width: BAR_W,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  loading: {
    marginTop: 10,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.colors.text.muted,
  },
  paw: {
    position: 'absolute',
  },
});

export default LoaderScreen;
