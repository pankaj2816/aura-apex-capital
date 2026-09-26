import MarketChart from '@/components/markets/MarketChart';
import MarketLedger from '@/components/markets/MarketLedger';

export const metadata = {
  title: 'Markets · Aura & Apex Capital',
  description: 'Session tape, candlestick book, and the fixture ledger.',
};

export default function MarketsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] muted">Session book</p>
        <h1 className="display text-3xl md:text-5xl">Markets</h1>
        <p className="mt-2 max-w-2xl text-sm muted">
          $APEX, $AURA, $TWIN, and $SOLR are fictional marks. The candles are a generated book for this desk, not a live exchange.
        </p>
      </header>
      <MarketChart />
      <MarketLedger />
    </div>
  );
}
