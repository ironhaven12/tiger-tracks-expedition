import React from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { SpeciesId } from '../constants/config';
import THEME from '../constants/theme';

type Props = {
  species: SpeciesId;
  size?: number;
  color?: string;
  opacity?: number;
};

/**
 * The five footprints are drawn, never imported — one deterministic path set
 * per species so a print is always readable at any size.
 */
export function PawPrint({
  species,
  size = 46,
  color = THEME.colors.gold,
  opacity = 1,
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G opacity={opacity}>{renderSpecies(species, color)}</G>
    </Svg>
  );
}

function renderSpecies(species: SpeciesId, color: string) {
  switch (species) {
    case 'CHITAL':
      return (
        <G>
          <Path
            d="M44 22 C32 40 28 58 36 76 C44 70 48 52 48 30 Z"
            fill={color}
          />
          <Path
            d="M56 22 C68 40 72 58 64 76 C56 70 52 52 52 30 Z"
            fill={color}
          />
        </G>
      );
    case 'LANGUR':
      return (
        <G>
          <Ellipse cx="50" cy="66" rx="20" ry="24" fill={color} />
          <Ellipse cx="26" cy="46" rx="6" ry="12" fill={color} />
          <Ellipse cx="40" cy="30" rx="6" ry="14" fill={color} />
          <Ellipse cx="54" cy="26" rx="6" ry="15" fill={color} />
          <Ellipse cx="68" cy="32" rx="6" ry="13" fill={color} />
          <Ellipse cx="78" cy="52" rx="6" ry="10" fill={color} />
        </G>
      );
    case 'PEACOCK':
      return (
        <G>
          <Path d="M48 58 L26 20 L34 16 L52 52 Z" fill={color} />
          <Path d="M50 58 L50 14 L58 14 L56 56 Z" fill={color} />
          <Path d="M52 58 L74 20 L80 26 L58 56 Z" fill={color} />
          <Path d="M48 58 L42 90 L50 90 L56 58 Z" fill={color} />
          <Circle cx="50" cy="58" r="8" fill={color} />
        </G>
      );
    case 'BOAR':
      return (
        <G>
          <Path
            d="M44 20 C34 38 32 60 40 78 C46 72 48 48 48 26 Z"
            fill={color}
          />
          <Path
            d="M56 20 C66 38 68 60 60 78 C54 72 52 48 52 26 Z"
            fill={color}
          />
          <Circle cx="28" cy="80" r="7" fill={color} />
          <Circle cx="72" cy="80" r="7" fill={color} />
        </G>
      );
    case 'TIGER':
    default:
      return (
        <G>
          <Path
            d="M50 44 C68 44 82 56 82 70 C82 84 68 90 50 90 C32 90 18 84 18 70 C18 56 32 44 50 44 Z"
            fill={color}
          />
          <Ellipse cx="22" cy="36" rx="10" ry="12" fill={color} />
          <Ellipse cx="41" cy="22" rx="10" ry="13" fill={color} />
          <Ellipse cx="60" cy="22" rx="10" ry="13" fill={color} />
          <Ellipse cx="79" cy="36" rx="10" ry="12" fill={color} />
        </G>
      );
  }
}

/** Decorative paw used in backgrounds — always the tiger silhouette. */
export function PawDecor({
  size = 96,
  color = THEME.colors.green,
  opacity = 0.12,
  rotation = 0,
}: {
  size?: number;
  color?: string;
  opacity?: number;
  rotation?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G opacity={opacity} rotation={rotation} origin="50, 50">
        {renderSpecies('TIGER', color)}
      </G>
    </Svg>
  );
}

/** Two-leaf fern ornament used on closed thicket cells. */
export function LeafOrnament({
  size = 34,
  color = THEME.colors.green,
  opacity = 0.25,
  rotation = 0,
}: {
  size?: number;
  color?: string;
  opacity?: number;
  rotation?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G opacity={opacity} rotation={rotation} origin="50, 50">
        <Path
          d="M50 92 C50 64 36 40 14 28 C14 58 28 82 50 92 Z"
          fill={color}
        />
        <Path
          d="M50 92 C50 64 64 40 86 28 C86 58 72 82 50 92 Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

/** Thorn branch glyph for the thorn thicket cells. */
export function ThornGlyph({
  size = 40,
  color = THEME.colors.orangeLight,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path
        d="M14 86 L86 14"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <Path d="M40 60 L22 46 L44 44 Z" fill={color} />
      <Path d="M60 40 L78 54 L56 56 Z" fill={color} />
      <Path d="M30 76 L16 62 L34 60 Z" fill={color} />
    </Svg>
  );
}

export default PawPrint;
