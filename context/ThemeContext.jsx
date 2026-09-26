'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isTheme, paletteFor } from '@/lib/themes';

const ThemeContext = createContext(null);

function paint(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme === 'midnight' ? 'dark' : 'light';
  try {
    localStorage.setItem('aac-theme', theme);
  } catch (err) {
    /* private mode */
  }
  document.cookie = `aac-theme=${theme}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeProvider({ initialTheme = 'midnight', children }) {
  const [theme, setThemeState] = useState(isTheme(initialTheme) ? initialTheme : 'midnight');

  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    if (isTheme(attr) && attr !== theme) setThemeState(attr);
    // Align the cookie with the painted theme once, after hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = (next) => {
    if (!isTheme(next) || next === theme) return;
    setThemeState(next);
    paint(next);
  };

  const value = useMemo(
    () => ({ theme, setTheme, palette: paletteFor(theme) }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: 'midnight', setTheme: () => {}, palette: paletteFor('midnight') };
  }
  return ctx;
}
