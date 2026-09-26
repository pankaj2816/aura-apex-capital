import Link from 'next/link';
import Mark from './Mark';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-[rgb(var(--line)/var(--line-alpha))]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Mark className="h-7 w-7" />
          <div>
            <p className="text-sm tracking-[0.14em]">AURA & APEX CAPITAL</p>
            <p className="text-xs muted">Spatial Architecture. Algorithmic Real Estate. Curated Living.</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm" aria-label="Footer">
          <Link href="/studio">Studio</Link>
          <Link href="/markets">Markets</Link>
          <Link href="/properties">Catalog</Link>
        </nav>
        <p className="text-xs muted">© {year} Aura & Apex Capital. Fictional desk. No live orders.</p>
      </div>
    </footer>
  );
}
