import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import THEME from '../constants/theme';

/**
 * Press feedback: the Pressable stays the PARENT, the Animated.View is the
 * child. Only transform is animated, so useNativeDriver is safe.
 */
export function usePressScale(enabled = true, to = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    if (!enabled) {
      return;
    }
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      tension: THEME.animation.press.tension,
      friction: THEME.animation.press.friction,
    }).start();
  }, [enabled, scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: THEME.animation.press.tension,
      friction: THEME.animation.press.friction,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
