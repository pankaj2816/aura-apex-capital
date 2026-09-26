'use client';

import { DISTRICTS, PROPERTIES, districtById } from '@/data/fixtures';

export default function DistrictMap({ properties, onOpen }) {
  return (
    <div className="panel overflow-hidden rounded-3xl">
      <svg viewBox="0 0 760 460" className="h-[420px] w-full md:h-[520px]" role="img" aria-label="Schematic map of the five districts">
        <rect width="760" height="460" fill="rgb(var(--bg-2))" />
        <path d="M40 300 C 160 250, 240 340, 360 280 S 560 220, 720 300" fill="none" stroke="rgb(var(--accent) / 0.45)" strokeWidth="18" />
        <path d="M80 120 C 200 80, 300 160, 420 90 S 640 70, 700 140" fill="none" stroke="rgb(var(--gold) / 0.35)" strokeWidth="8" />
        {DISTRICTS.map((district) => (
          <g key={district.id}>
            <text x={district.x} y={district.y - 28} fill="rgb(var(--muted))" fontSize="11">
              {district.label}
            </text>
            <text x={district.x} y={district.y - 12} fill="rgb(var(--ink))" fontSize="14">
              {district.name}
            </text>
          </g>
        ))}
        {properties.map((property) => {
          const district = districtById(property.districtId);
          const index = PROPERTIES.filter((item) => item.districtId === property.districtId).findIndex((item) => item.id === property.id);
          const x = district.x + (index % 3) * 16;
          const y = district.y + Math.floor(index / 3) * 16;
          return (
            <g key={property.id} transform={`translate(${x} ${y})`}>
              <circle r="7" fill="rgb(var(--accent))" />
              <foreignObject x="-8" y="-8" width="16" height="16">
                <button
                  type="button"
                  aria-label={`Open ${property.name}`}
                  className="h-4 w-4 rounded-full"
                  onClick={() => onOpen(property.id)}
                />
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
