'use client';

import { THEMES } from '@/lib/themes';
import { useTheme } from '@/context/ThemeContext';

export function ThemeSwitcher({ compact = false }) {
  const { theme, setTheme } = useTheme();
  return (
    <div className="seg flex items-center gap-1" role="group" aria-label="Color theme">
      {THEMES.map((item) => (
        <button
          key={item.id}
          type="button"
          title={item.name}
          aria-pressed={theme === item.id}
          onClick={() => setTheme(item.id)}
          className="chip rounded-full px-2.5 py-1 text-xs"
        >
          {compact ? item.short : item.short}
        </button>
      ))}
    </div>
  );
}

export function ThemeHud() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="fixed bottom-4 left-4 z-40 w-44">
      <div className="panel rounded-2xl p-2">
        <p className="px-2 pb-1 text-[0.65rem] uppercase tracking-[0.18em] muted">Theme</p>
        <div className="flex flex-col gap-1">
          {THEMES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={theme === item.id}
              onClick={() => setTheme(item.id)}
              className="chip rounded-xl px-2 py-1.5 text-left text-xs"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
