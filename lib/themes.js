export const THEME_IDS = ['midnight', 'alabaster', 'champagne'];

export const THEMES = [
  {
    id: 'alabaster',
    name: 'Modern Alabaster',
    short: 'Alabaster',
    hint: 'Zinc lines, obsidian type, slate blue',
  },
  {
    id: 'midnight',
    name: 'Midnight Trader',
    short: 'Midnight',
    hint: 'Frosted glass, sapphire, emerald, cyan',
  },
  {
    id: 'champagne',
    name: 'Nordic Champagne',
    short: 'Champagne',
    hint: 'Parchment, bronze, serif headings',
  },
];

export function isTheme(value) {
  return THEME_IDS.includes(value);
}

export function paletteFor(theme) {
  if (theme === 'alabaster') {
    return {
      sky: '#f4f4f5',
      fog: '#e7e7ea',
      key: '#4c6a92',
      fill: '#d5dde8',
      glass: '#f7fbff',
      metal: '#5c6774',
      pool: '#3d6f8f',
      bronze: '#4c6a92',
      ground: '#e4e4e7',
      sapphire: '#4c6a92',
      cyan: '#3d6d86',
      emerald: '#1f6b4a',
      ink: '#121417',
    };
  }
  if (theme === 'champagne') {
    return {
      sky: '#f3ebdd',
      fog: '#e7dcc8',
      key: '#c6a15b',
      fill: '#efe4d2',
      glass: '#fff8ee',
      metal: '#8a6a3b',
      pool: '#3f6f66',
      bronze: '#8a6a3b',
      ground: '#e6d9c4',
      sapphire: '#8a6a3b',
      cyan: '#6e8f86',
      emerald: '#3f6b45',
      ink: '#2c241c',
    };
  }
  return {
    sky: '#070a10',
    fog: '#070a10',
    key: '#9ec5ff',
    fill: '#122033',
    glass: '#c5e4ff',
    metal: '#93a4b8',
    pool: '#1ee0c0',
    bronze: '#d6b25e',
    ground: '#101820',
    sapphire: '#5b8def',
    cyan: '#3ee0ff',
    emerald: '#1fbf75',
    ink: '#e7eef9',
  };
}
