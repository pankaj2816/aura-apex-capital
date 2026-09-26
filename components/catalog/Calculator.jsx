'use client';

import { useMemo, useState } from 'react';
import { distributionYield, mortgagePayment, readAmount } from '@/lib/finance';
import { formatMoney, formatPlainPercent } from '@/lib/format';

const FIELDS = [
  { id: 'price', label: 'Price', min: 0, max: 80000000, fallback: 18400000 },
  { id: 'down', label: 'Down payment', min: 0, max: 80000000, fallback: 3680000 },
  { id: 'rate', label: 'Interest %', min: 0, max: 25, fallback: 5.25 },
  { id: 'years', label: 'Years', min: 0, max: 40, fallback: 30 },
  { id: 'tax', label: 'Annual tax', min: 0, max: 250000, fallback: 42000 },
  { id: 'hoa', label: 'Monthly dues', min: 0, max: 50000, fallback: 1800 },
  { id: 'distribution', label: 'Annual distribution', min: 0, max: 20000000, fallback: 883200 },
];

export default function Calculator({ property }) {
  const [raw, setRaw] = useState(() => ({
    price: String(property.price),
    down: String(Math.round(property.price * 0.2)),
    rate: '5.25',
    years: '30',
    tax: String(Math.round(property.price * 0.002)),
    hoa: property.class === 'reit' ? '0' : '1800',
    distribution: String(property.distribution || 0),
  }));

  const parsed = useMemo(() => {
    const next = {};
    const warnings = [];
    FIELDS.forEach((field) => {
      const result = readAmount(raw[field.id], field.fallback, field.min, field.max);
      next[field.id] = result.value;
      if (result.warning) warnings.push(`${field.label}: ${result.warning}`);
    });
    if (next.down > next.price) {
      next.down = next.price;
      warnings.push('Down payment was clamped to the price.');
    }
    return { next, warnings };
  }, [raw]);

  const principal = Math.max(0, parsed.next.price - parsed.next.down);
  const monthly = mortgagePayment({
    principal,
    annualRatePercent: parsed.next.rate,
    years: parsed.next.years,
  });
  const carrying = monthly + parsed.next.tax / 12 + parsed.next.hoa;
  const yieldPct = distributionYield(parsed.next.price, parsed.next.distribution);
  const annualDebt = monthly * 12;
  const net = parsed.next.distribution - annualDebt - parsed.next.tax - parsed.next.hoa * 12;

  return (
    <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.id} className="text-xs">
            <span className="muted">{field.label}</span>
            <input
              inputMode="decimal"
              value={raw[field.id]}
              onChange={(event) =>
                setRaw((current) => ({ ...current, [field.id]: event.target.value.slice(0, 16) }))
              }
              className="chip mt-1 w-full rounded-xl px-3 py-2 text-sm"
            />
          </label>
        ))}
      </div>
      {parsed.warnings.length > 0 && (
        <ul className="text-xs text-amber-600">
          {parsed.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs muted">Loan</dt>
          <dd>{formatMoney(principal)}</dd>
        </div>
        <div>
          <dt className="text-xs muted">Monthly debt</dt>
          <dd>{formatMoney(monthly)}</dd>
        </div>
        <div>
          <dt className="text-xs muted">Carrying cost</dt>
          <dd>{formatMoney(carrying)}</dd>
        </div>
        <div>
          <dt className="text-xs muted">Distribution yield</dt>
          <dd>{formatPlainPercent(yieldPct)}</dd>
        </div>
      </dl>
      <p className="text-xs muted">
        Net of debt, tax, and dues: {formatMoney(net)} a year. A zero rate uses straight division. A zero loan or a zero term pays nothing.
      </p>
    </form>
  );
}
