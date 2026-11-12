import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SpeciesId } from '../constants/config';
import THEME from '../constants/theme';
import PawPrint, { LeafOrnament, ThornGlyph } from './PawPrint';

export type CellVisual = 'closed' | 'empty' | 'track' | 'thorn';

type Props = {
  index: number;
  size: number;
  visual: CellVisual;
  proximity: number;
  species: SpeciesId | null;
  scanned: boolean;
  hintsOn: boolean;
  reducedMotion: boolean;
  onPress: (index: number) => void;
};

const PROXIMITY_COLORS = [
  THEME.colors.text.muted,
  THEME.colors.green,
  THEME.colors.gold,
  THEME.colors.orange,
];

function proximityColor(count: number): string {
  return PROXIMITY_COLORS[Math.min(count, PROXIMITY_COLORS.length - 1)];
}

function ThicketCellBase({
  index,
  size,
  visual,
  proximity,
  species,
  scanned,
  hintsOn,
  reducedMotion,
  onPress,
}: Props) {
  const scale = useRef(new Animated.Value(visual === 'closed' ? 1 : 1)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const opened = visual !== 'closed';

  useEffect(() => {
    if (!opened) {
      scale.setValue(1);
      ring.setValue(0);
      return;
    }
    scale.setValue(0.9);
    Animated.timing(scale, {
      toValue: 1,
      duration: reducedMotion ? 60 : 160,
      useNativeDriver: true,
    }).start();

    if (visual === 'track') {
      ring.setValue(0);
      Animated.timing(ring, {
        toValue: 1,
        duration: reducedMotion ? 160 : 420,
        useNativeDriver: true,
      }).start();
    }
  }, [opened, visual, reducedMotion, scale, ring]);

  const inner = size - 6;
  const ornamentRotation = ((index * 37) % 180) - 90;

  const handlePress = React.useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`THICKET ${index + 1}`}
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, { width: size, height: size }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.cell,
          {
            width: inner,
            height: inner,
            transform: [{ scale }],
          },
          visual === 'empty' ? styles.cellEmpty : null,
          visual === 'track' ? styles.cellTrack : null,
          visual === 'thorn' ? styles.cellThorn : null,
        ]}>
        {visual === 'closed' ? (
          <LinearGradient
            colors={[...THEME.gradients.cellClosed]}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <View pointerEvents="none" style={styles.innerLight} />

        {visual === 'closed' ? (
          <View pointerEvents="none" style={styles.ornament}>
            <LeafOrnament
              size={Math.round(inner * 0.5)}
              rotation={ornamentRotation}
              opacity={scanned ? 0.12 : 0.25}
            />
          </View>
        ) : null}

        {visual === 'closed' && scanned ? (
          <View pointerEvents="none" style={styles.scanBadge}>
            <Text style={[styles.scanText, { color: proximityColor(proximity) }]}>
              {String(proximity)}
            </Text>
          </View>
        ) : null}

        {visual === 'empty' ? (
          <Text
            style={[
              styles.proximity,
              { color: hintsOn ? proximityColor(proximity) : THEME.colors.text.muted },
            ]}>
            {hintsOn ? String(proximity) : '·'}
          </Text>
        ) : null}

        {visual === 'thorn' ? (
          <ThornGlyph size={Math.round(inner * 0.5)} />
        ) : null}

        {visual === 'track' && species ? (
          <View style={styles.center}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.ring,
                {
                  width: inner * 0.7,
                  height: inner * 0.7,
                  borderRadius: (inner * 0.7) / 2,
                  opacity: ring.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 0],
                  }),
                  transform: [
                    {
                      scale: ring.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 1.6],
                      }),
                    },
                  ],
                },
              ]}
            />
            <PawPrint species={species} size={Math.round(inner * 0.62)} />
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    borderRadius: THEME.radius.cell,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: THEME.colors.bg.cell,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cellEmpty: {
    backgroundColor: '#16281D',
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cellTrack: {
    backgroundColor: '#143324',
    borderColor: THEME.colors.green,
  },
  cellThorn: {
    backgroundColor: THEME.colors.bg.thorn,
    borderColor: THEME.colors.orange,
  },
  innerLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: THEME.colors.ui.innerLight,
  },
  ornament: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
  },
  scanText: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  proximity: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: THEME.colors.green,
  },
});

export const ThicketCell = React.memo(ThicketCellBase);
export default ThicketCell;
