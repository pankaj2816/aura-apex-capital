'use client';

import { TICKERS } from '@/data/fixtures';
import { formatPercent } from '@/lib/format';
import { useDesk } from '@/context/DeskContext';

export default function MarketTape() {
  const { symbol, setSymbol } = useDesk();
  const row = [...TICKERS, ...TICKERS];

  return (
    <div className="border-b border-[rgb(var(--line)/var(--line-alpha))] bg-[rgb(var(--bg-2)/0.65)]">
      <div className="tape-viewport">
        <div className="tape-track py-2">
          {row.map((ticker, index) => {
            const up = ticker.change >= 0;
            const focused = ticker.symbol === symbol;
            return (
              <button
                key={`${ticker.symbol}-${index}`}
                type="button"
                onClick={() => setSymbol(ticker.symbol)}
                className="mx-6 flex items-baseline gap-2 whitespace-nowrap text-sm"
                aria-pressed={focused}
              >
                <span className={focused ? 'text-accent' : ''}>${ticker.symbol}</span>
                <span className="muted hidden sm:inline">{ticker.name}</span>
                <span className={up ? 'up' : 'down'}>{formatPercent(ticker.change)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
