import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import THEME from '../constants/theme';
import { StarGlyph } from './StarRow';

type Props = {
  total: number;
  reached: number;
  reducedMotion: boolean;
};

const NODE = 28;

/** Hidden clearings of the route, joined by a dotted line. */
export function RouteMapStrip({ total, reached, reducedMotion }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reducedMotion) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.12,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [pulse, reducedMotion]);

  const nodes = Array.from({ length: total }, (_, i) => i);

  return (
    <View style={styles.wrap}>
      <Text style={styles.caption}>{`ROUTE ${Math.min(
        reached + 1,
        total,
      )} / ${total}`}</Text>
      <View style={styles.track}>
        <View style={styles.connector}>
          <Svg width="100%" height={2}>
            <Line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth={2}
              strokeDasharray="4,6"
            />
          </Svg>
        </View>
        {nodes.map(i => {
          const done = i < reached;
          const current = i === reached;
          return (
            <Animated.View
              key={`node-${i}`}
              pointerEvents="none"
              style={[
                styles.node,
                done ? styles.nodeDone : null,
                current ? styles.nodeCurrent : null,
                current ? { transform: [{ scale: pulse }] } : null,
              ]}>
              {done ? (
                <Text style={styles.nodeMark}>{'✓'}</Text>
              ) : null}
              {current ? <StarGlyph size={14} color="#3A2A08" /> : null}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 64,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  caption: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.colors.text.muted,
    marginBottom: 6,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: NODE,
  },
  connector: {
    position: 'absolute',
    left: NODE / 2,
    right: NODE / 2,
    top: NODE / 2 - 1,
  },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: {
    backgroundColor: THEME.colors.green,
    borderColor: THEME.colors.green,
  },
  nodeCurrent: {
    backgroundColor: THEME.colors.gold,
    borderColor: THEME.colors.gold,
  },
  nodeMark: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '900',
    color: '#06240F',
  },
});

export default RouteMapStrip;
