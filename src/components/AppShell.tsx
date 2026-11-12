import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import THEME from '../constants/theme';

export type ShellVariant = 'loader' | 'menu' | 'panel' | 'board' | 'win' | 'lose';

type Props = {
  variant: ShellVariant;
  children?: React.ReactNode;
};

type Blob = { size: number; color: string; top?: number; bottom?: number; left?: number; right?: number };

const BG_OPACITY: Record<ShellVariant, number> = {
  loader: 0.35,
  menu: 1,
  panel: 0.12,
  board: 0.16,
  win: 0.22,
  lose: 0.22,
};

const GRADIENTS: Record<ShellVariant, string[]> = {
  loader: [...THEME.gradients.loader],
  menu: [...THEME.gradients.menuScrim],
  panel: [...THEME.gradients.panel],
  board: [...THEME.gradients.panel],
  win: [...THEME.gradients.win],
  lose: [...THEME.gradients.lose],
};

const BLOBS: Record<ShellVariant, Blob[]> = {
  loader: [
    { size: 220, color: 'rgba(0,230,118,0.10)', top: -40, left: -60 },
    { size: 260, color: 'rgba(255,109,0,0.08)', bottom: -70, right: -70 },
    { size: 180, color: 'rgba(255,194,71,0.06)', top: 300, right: -60 },
  ],
  menu: [{ size: 260, color: 'rgba(0,230,118,0.07)', bottom: 40, left: -70 }],
  panel: [{ size: 240, color: 'rgba(255,109,0,0.06)', top: -50, right: -60 }],
  board: [{ size: 240, color: 'rgba(0,230,118,0.06)', top: 120, left: -80 }],
  win: [{ size: 280, color: 'rgba(0,230,118,0.12)', top: -60, left: -40 }],
  lose: [{ size: 280, color: 'rgba(255,59,48,0.10)', top: -60, left: -40 }],
};

/**
 * Background composition shared by every screen: the one background PNG,
 * a gradient scrim and 1-3 soft blobs. Variants keep the screens apart.
 */
export function AppShell({ variant, children }: Props) {
  const blobs = BLOBS[variant];
  const isMenu = variant === 'menu';

  return (
    <View style={styles.root}>
      <ImageBackground
        source={assets.bgGame}
        resizeMode="cover"
        style={[styles.fill, isMenu ? styles.menuArt : null]}
        imageStyle={{ opacity: BG_OPACITY[variant] }}>
        <LinearGradient
          colors={GRADIENTS[variant]}
          locations={isMenu ? [0, 0.62, 1] : [0, 0.5, 1]}
          style={styles.fill}
        />
      </ImageBackground>

      {variant === 'loader' ? (
        <View pointerEvents="none" style={styles.loaderVeil} />
      ) : null}

      <View pointerEvents="none" style={styles.fill}>
        {blobs.map((blob, i) => (
          <View
            key={`blob-${i}`}
            style={[
              styles.blob,
              {
                width: blob.size,
                height: blob.size,
                borderRadius: blob.size / 2,
                backgroundColor: blob.color,
                top: blob.top,
                bottom: blob.bottom,
                left: blob.left,
                right: blob.right,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.bg.deep,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  menuArt: {
    bottom: undefined,
    height: '58%',
  },
  loaderVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,15,10,0.88)',
  },
  blob: {
    position: 'absolute',
  },
  content: {
    flex: 1,
  },
});

export default AppShell;
