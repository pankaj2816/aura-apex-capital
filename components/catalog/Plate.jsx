export default function Plate({ id, label }) {
  const seed = String(id || 'aura')
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const tower = 80 + (seed % 70);
  const wing = 40 + ((seed * 3) % 50);
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" role="img" aria-label={label || 'Architectural plate'}>
      <rect width="400" height="260" className="plate-sky" />
      <rect x="0" y="190" width="400" height="70" className="plate-ground" />
      <rect x={70 + (seed % 20)} y={120 - wing / 6} width={wing} height={70 + wing / 5} className="plate-mass" />
      <rect x="150" y={70} width={tower} height={140} className="plate-glass" />
      <rect x="150" y="62" width={tower} height="8" className="plate-line" />
      <path d={`M40 190 H360`} className="plate-line" strokeWidth="1.2" />
      <circle cx={300 - (seed % 30)} cy="78" r="16" fill="none" stroke="rgb(var(--gold))" />
    </svg>
  );
}
