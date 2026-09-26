const ROOMS = [
  { id: 'hall', label: 'Great hall', x: 70, y: 70, w: 180, h: 110 },
  { id: 'gallery', label: 'Gallery', x: 260, y: 70, w: 140, h: 70 },
  { id: 'pool', label: 'Sky pool', x: 260, y: 150, w: 140, h: 70 },
  { id: 'canopy', label: 'Canopy terrace', x: 70, y: 190, w: 180, h: 50 },
  { id: 'vault', label: 'Wine vault', x: 420, y: 70, w: 110, h: 80 },
  { id: 'climate', label: 'Climate core', x: 420, y: 160, w: 110, h: 80 },
  { id: 'helipad', label: 'Helipad', x: 420, y: 250, w: 110, h: 40 },
];

export default function FloorPlan({ onHotspot }) {
  return (
    <svg viewBox="0 0 560 320" className="h-full w-full" role="img" aria-label="Floor plan of the monolith villa">
      <rect width="560" height="320" fill="rgb(var(--bg-2))" />
      <text x="24" y="28" fill="rgb(var(--muted))" fontSize="11">
        MONOLITH VILLA · LEVEL 01 + ROOF
      </text>
      {ROOMS.map((room) => (
        <g key={room.id}>
          <rect
            x={room.x}
            y={room.y}
            width={room.w}
            height={room.h}
            fill="rgb(var(--card))"
            stroke="rgb(var(--accent))"
            strokeWidth="1.2"
          />
          <text x={room.x + 8} y={room.y + 20} fill="rgb(var(--ink))" fontSize="12">
            {room.label}
          </text>
        </g>
      ))}
      {onHotspot &&
        ['pool', 'helipad', 'vault', 'canopy'].map((id) => {
          const room = ROOMS.find((item) => item.id === id);
          return (
            <foreignObject key={id} x={room.x + 8} y={room.y + room.h - 28} width="88" height="22">
              <button type="button" className="chip rounded-full px-2 text-[10px]" onClick={() => onHotspot(id)}>
                Focus
              </button>
            </foreignObject>
          );
        })}
    </svg>
  );
}
