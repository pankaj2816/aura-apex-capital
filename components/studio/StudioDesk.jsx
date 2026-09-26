'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HOTSPOTS, PROPERTIES, VILLA_METRICS, propertyById } from '@/data/fixtures';
import { useDesk } from '@/context/DeskContext';
import { useTheme } from '@/context/ThemeContext';
import SpatialStage from './SpatialStage';

const LIGHTS = [
  { id: 'dawn', label: 'Dawn' },
  { id: 'noon', label: 'Noon' },
  { id: 'golden', label: 'Golden Hour' },
  { id: 'midnight', label: 'Midnight' },
];

export default function StudioDesk({ compact = false }) {
  const { palette } = useTheme();
  const { activeId, setActiveId } = useDesk();
  const [mode, setMode] = useState('monolith');
  const [explode, setExplode] = useState(false);
  const [light, setLight] = useState('golden');
  const [hotspot, setHotspot] = useState('pool');
  const spot = HOTSPOTS.find((item) => item.id === hotspot) || HOTSPOTS[0];
  const active = propertyById(activeId);

  return (
    <div className={compact ? '' : 'mx-auto max-w-7xl px-4 py-6 sm:px-6'}>
      {!compact && (
        <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] muted">Spatial studio</p>
            <h1 className="display mt-1 text-3xl md:text-4xl">Monolith Villa, District 01</h1>
          </div>
          <div className="seg flex flex-wrap gap-2">
            <button type="button" className="chip rounded-full px-3 py-1.5 text-sm" aria-pressed={mode === 'monolith'} onClick={() => setMode('monolith')}>
              Monolith
            </button>
            <button type="button" className="chip rounded-full px-3 py-1.5 text-sm" aria-pressed={mode === 'district'} onClick={() => setMode('district')}>
              District
            </button>
          </div>
        </header>
      )}

      <div className="panel relative overflow-hidden rounded-3xl">
        <div className={compact ? 'h-[320px] sm:h-[420px]' : 'h-[52vh] min-h-[360px] md:h-[68vh]'}>
          <SpatialStage
            mode={compact ? 'monolith' : mode}
            explode={explode}
            light={light}
            palette={palette}
            hotspot={hotspot}
            onHotspot={setHotspot}
            properties={PROPERTIES}
            activeId={activeId}
            onSelect={setActiveId}
            compact={compact}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between gap-3 p-3">
          <div className="pointer-events-auto panel max-w-sm rounded-2xl px-3 py-2">
            {mode === 'district' && !compact ? (
              <>
                <p className="text-xs uppercase tracking-[0.16em] muted">Active listing</p>
                <p className="mt-1 text-sm">{active ? active.name : 'Select a tower'}</p>
                {active && (
                  <Link href={`/properties/${active.id}`} className="mt-1 inline-block text-xs text-accent">
                    Open the dossier
                  </Link>
                )}
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.16em] muted">{spot.label}</p>
                <p className="mt-1 text-sm leading-snug">{spot.spec}</p>
                <p className="mt-1 text-xs muted">{spot.stat}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[rgb(var(--line)/var(--line-alpha))] p-3 md:flex-row md:items-center md:justify-between">
          <dl className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
            {VILLA_METRICS.map((metric) => (
              <div key={metric.label}>
                <dt className="text-[0.65rem] uppercase tracking-[0.14em] muted">{metric.label}</dt>
                <dd className="text-sm">{metric.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="chip rounded-full px-3 py-1.5 text-sm"
                aria-pressed={explode}
                onClick={() => setExplode((value) => !value)}
              >
                {explode ? 'Assemble' : 'Explode'}
              </button>
              <div className="seg flex flex-wrap gap-1">
                {LIGHTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="chip rounded-full px-2.5 py-1 text-xs"
                    aria-pressed={light === item.id}
                    onClick={() => setLight(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
          </div>
        </div>
      </div>

      {!compact && mode === 'monolith' && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HOTSPOTS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="panel rounded-2xl p-4 text-left"
              onClick={() => setHotspot(item.id)}
            >
              <p className="text-sm">{item.label}</p>
              <p className="mt-1 text-xs muted">{item.stat}</p>
            </button>
          ))}
        </div>
      )}

      {!compact && mode === 'district' && (
        <p className="mt-4 text-sm muted">
          Towers glow by book: emerald for yield, sapphire for luxury, cyan for commercial. A click sets the active listing and its ticker.
        </p>
      )}
    </div>
  );
}
