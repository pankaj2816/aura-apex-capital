# Aura & Apex Capital

A fixture-backed desk for spatial architecture, 3D digital twins, market ledgers, and curated real estate investment. Districts, tickers, and listings are fictional.

Tagline: Spatial Architecture. Algorithmic Real Estate. Curated Living.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). To use another port:

```bash
npm run dev -- -p 43123
```

No database, API key, or `.env` file is required. The atlas, studio, markets, and catalog read `data/fixtures.js`.

If `MONGODB_URI` and Google sign-in are configured, the original account routes (profile, messages, saved listings) still talk to MongoDB. Without those secrets they show a quiet notice instead of failing.

## Desk

- **Atlas** (`/`) — brand, districts, and villa entries
- **Studio** (`/studio`) — orbit, pan, and zoom the monolith villa; hotspots; assemble or explode; dawn, noon, golden hour, and midnight light; district skyline
- **Markets** (`/markets`) — tape, area and candlestick chart, sortable ledger with CSV and JSON download
- **Catalog** (`/properties`) — villas, sky penthouses, fractional notes, and commercial assets, with a dossier, calculator, tour confirmation, and compare dock

Themes: Midnight Trader (default), Modern Alabaster, and Nordic Champagne. The choice is stored in `localStorage` and a `aac-theme` cookie.

## Stack

Next.js 14, React 18, Tailwind CSS, React Three Fiber, and Recharts.
