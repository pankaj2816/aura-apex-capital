'use client';

import { useEffect, useRef } from 'react';
import { HOTSPOTS, VILLA_METRICS } from '@/data/fixtures';

const LIGHT_WASH = {
  dawn: 'rgb(255 179 138 / 0.35)',
  noon: 'rgb(255 255 255 / 0.2)',
  golden: 'rgb(255 196 107 / 0.4)',
  midnight: 'rgb(40 70 140 / 0.45)',
};

export default function StudioFallback({
  mode,
  explode,
  light,
  hotspot,
  onHotspot,
  properties,
  activeId,
  onSelect,
}) {
  const frame = useRef(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== 'district') return undefined;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      properties.forEach((property, index) => {
        const col = index % 6;
        const row = Math.floor(index / 6);
        const x = 28 + col * ((width - 48) / 6);
        const h = 30 + (property.price / 54000000) * (height * 0.55);
        const y = height - 36 - row * 8 - h;
        const active = property.id === activeId;
        context.fillStyle = active ? 'rgb(91 141 239)' : 'rgb(91 141 239 / 0.45)';
        if (property.class === 'reit') context.fillStyle = active ? 'rgb(31 191 117)' : 'rgb(31 191 117 / 0.5)';
        if (property.class === 'commercial') context.fillStyle = active ? 'rgb(62 224 255)' : 'rgb(62 224 255 / 0.45)';
        context.fillRect(x, y, 28, h);
      });
    };

    const onResize = () => {
      window.cancelAnimationFrame(frame.current);
      frame.current = window.requestAnimationFrame(draw);
    };
    frame.current = window.requestAnimationFrame(draw);
    window.addEventListener('resize', onResize);
    return () => {
      window.cancelAnimationFrame(frame.current);
      window.removeEventListener('resize', onResize);
    };
  }, [mode, properties, activeId]);

  if (mode === 'district') {
    return (
      <div className="relative h-full w-full">
        <canvas ref={canvasRef} className="h-full w-full" aria-label="District skyline drawn without WebGL" />
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2">
          {properties.slice(0, 6).map((property) => (
            <button
              key={property.id}
              type="button"
              className="chip rounded-full px-3 py-1 text-xs"
              data-active={property.id === activeId}
              onClick={() => onSelect(property.id)}
            >
              {property.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const shift = explode ? 18 : 0;
  return (
    <div className="relative h-full w-full" style={{ background: LIGHT_WASH[light] || LIGHT_WASH.noon }}>
      <svg viewBox="0 0 640 420" className="h-full w-full" role="img" aria-label="Drawn cutaway of the monolith villa">
        <rect width="640" height="420" fill="rgb(var(--bg-2))" />
        <ellipse cx="320" cy="340" rx="220" ry="28" fill="rgb(var(--accent) / 0.15)" />
        <g style={{ transform: `translateY(${shift}px)` }}>
          <rect x="150" y="250" width="340" height="18" rx="2" fill="rgb(var(--muted) / 0.45)" />
        </g>
        <g style={{ transform: `translate(${-shift}px, ${-shift * 0.3}px)` }}>
          <rect x="130" y="210" width="90" height="48" fill="rgb(var(--ink) / 0.75)" />
        </g>
        <g style={{ transform: `translateY(${-shift}px)` }}>
          <rect x="210" y="150" width="200" height="110" fill="rgb(var(--accent) / 0.35)" stroke="rgb(var(--accent))" />
          <rect x="230" y="168" width="40" height="70" fill="rgb(var(--bg) / 0.35)" />
          <rect x="280" y="168" width="40" height="70" fill="rgb(var(--bg) / 0.35)" />
          <rect x="330" y="168" width="40" height="70" fill="rgb(var(--bg) / 0.35)" />
        </g>
        <g style={{ transform: `translateY(${-shift * 1.4}px)` }}>
          <rect x="170" y="132" width="300" height="10" fill="rgb(var(--gold))" />
        </g>
        <g style={{ transform: `translate(${shift}px, ${shift * 0.2}px)` }}>
          <rect x="400" y="236" width="120" height="16" fill="rgb(var(--cyan))" />
        </g>
        <g style={{ transform: `translate(${-shift}px, ${-shift * 1.1}px)` }}>
          <circle cx="188" cy="196" r="22" fill="none" stroke="rgb(var(--gold))" strokeWidth="3" />
        </g>
        <g style={{ transform: `translateY(${shift * 1.6}px)` }}>
          <rect x="270" y="286" width="90" height="28" fill="rgb(var(--danger) / 0.7)" />
        </g>
      </svg>
      <div className="absolute left-3 top-3 flex max-w-[14rem] flex-col gap-2">
        {HOTSPOTS.map((spot) => (
          <button
            key={spot.id}
            type="button"
            className="chip rounded-full px-3 py-1 text-left text-xs"
            data-active={hotspot === spot.id}
            onClick={() => onHotspot(spot.id)}
          >
            {spot.label}
          </button>
        ))}
      </div>
      <p className="absolute bottom-3 right-3 max-w-xs text-right text-xs muted">
        Spatial canvas unavailable. This cutaway is drawn in the plane.
      </p>
      <span className="sr-only">{VILLA_METRICS.map((item) => item.value).join(', ')}</span>
    </div>
  );
}
