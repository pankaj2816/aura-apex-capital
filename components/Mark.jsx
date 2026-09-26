export default function Mark({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="2" y="2" width="44" height="44" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 32 L24 12 L34 32" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="24" cy="27" r="3" fill="currentColor" />
    </svg>
  );
}
