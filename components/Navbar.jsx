'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Mark from './Mark';
import { ThemeSwitcher } from './ThemeControls';

const LINKS = [
  { href: '/', label: 'Atlas' },
  { href: '/studio', label: 'Studio' },
  { href: '/markets', label: 'Markets' },
  { href: '/properties', label: 'Catalog' },
];

function active(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-[rgb(var(--line)/var(--line-alpha))] bg-[rgb(var(--bg)/0.86)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-ink">
          <Mark className="h-8 w-8 shrink-0" />
          <span className="truncate text-sm font-semibold tracking-[0.14em]">AURA & APEX CAPITAL</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active(pathname, link.href) ? 'page' : undefined}
              className="rounded-full px-3 py-1.5 text-sm"
              data-active={active(pathname, link.href)}
              style={active(pathname, link.href) ? { background: 'rgb(var(--accent) / 0.16)' } : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden md:ml-3 md:block">
          <ThemeSwitcher />
        </div>
        <button
          type="button"
          className="chip ml-auto rounded-full px-3 py-1.5 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>
      {open && (
        <div id="mobile-nav" className="space-y-1 border-t border-[rgb(var(--line)/var(--line-alpha))] px-4 py-3 md:hidden">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="block rounded-xl px-3 py-2 text-sm">
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <ThemeSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
