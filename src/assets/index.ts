/**
 * The fixed Codex asset contract. Never invent another file name:
 * only the PNGs listed here exist on disk.
 */
export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  buttonRect: require('../../assets/button_rect.png'),
  buttonRound: require('../../assets/button_round.png'),
  sprite1: require('../../assets/sprite_1.png'),
  sprite2: require('../../assets/sprite_2.png'),
  sprite3: require('../../assets/sprite_3.png'),
  sprite4: require('../../assets/sprite_4.png'),
  sprite5: require('../../assets/sprite_5.png'),
} as const;

export const SPRITES = [
  assets.sprite1,
  assets.sprite2,
  assets.sprite3,
  assets.sprite4,
  assets.sprite5,
];

export default assets;
