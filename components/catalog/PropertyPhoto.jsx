'use client';

import { useState } from 'react';

export default function PropertyPhoto({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-[rgb(var(--bg-2))] ${className}`}
        role="img"
        aria-label={alt || 'Photograph unavailable'}
      >
        <div className="px-4 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.18em] muted">Photograph unavailable</p>
          {alt ? <p className="mt-2 text-sm">{alt}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
