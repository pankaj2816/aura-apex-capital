'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Customized,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TIMEFRAMES, sliceSeries } from '@/lib/marketSeries';
import { formatCompact } from '@/lib/format';
import { useDesk } from '@/context/DeskContext';
import { useTheme } from '@/context/ThemeContext';
import { TICKERS } from '@/data/fixtures';

const METRICS = [
  { id: 'price', label: 'Price', key: 'close' },
  { id: 'yield', label: 'Yield', key: 'yieldPct' },
  { id: 'volume', label: 'Volume', key: 'volume' },
  { id: 'spread', label: 'Spread', key: 'spread' },
];

function Candles({ xAxisMap, yAxisMap, points, up, down }) {
  const xAxis = xAxisMap ? Object.values(xAxisMap)[0] : null;
  const yAxis = yAxisMap?.price;
  if (!xAxis?.scale || !yAxis?.scale) return null;
  return (
    <g>
      {points.map((point, index) => {
        const x = xAxis.scale(point.date);
        const next = points[index + 1] ? xAxis.scale(points[index + 1].date) : x + 10;
        const prev = points[index - 1] ? xAxis.scale(points[index - 1].date) : x - 10;
        const slot = Math.max(4, Math.min(Math.abs(next - x), Math.abs(x - prev)));
        const body = Math.max(2, slot * 0.5);
        const rising = point.close >= point.open;
        const color = rising ? up : down;
        const yHigh = yAxis.scale(point.high);
        const yLow = yAxis.scale(point.low);
        const yOpen = yAxis.scale(point.open);
        const yClose = yAxis.scale(point.close);
        const top = Math.min(yOpen, yClose);
        const height = Math.max(1, Math.abs(yClose - yOpen));
        return (
          <g key={point.date}>
            <line x1={x} x2={x} y1={yHigh} y2={yLow} stroke={color} strokeWidth="1" />
            <rect x={x - body / 2} y={top} width={body} height={height} fill={color} />
          </g>
        );
      })}
    </g>
  );
}

function Crosshair({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="panel rounded-xl px-3 py-2 text-xs">
      <p className="muted">{label}</p>
      <p className="mt-1">O {row.open} · H {row.high}</p>
      <p>L {row.low} · C {row.close}</p>
      <p className="mt-1 muted">
        Yield {row.yieldPct}% · Vol {formatCompact(row.volume)} · Spread {row.spread}
      </p>
    </div>
  );
}

export default function MarketChart() {
  const { symbol, setSymbol } = useDesk();
  const { palette } = useTheme();
  const [frame, setFrame] = useState('1Y');
  const [metric, setMetric] = useState('price');
  const points = useMemo(() => sliceSeries(symbol, frame), [symbol, frame]);
  const metricDef = METRICS.find((item) => item.id === metric) || METRICS[0];
  const areaAxis = metric === 'price' ? 'price' : 'metric';

  return (
    <section className="panel rounded-3xl p-4 md:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] muted">Price book</p>
          <h2 className="display text-2xl">${symbol}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {TICKERS.map((ticker) => (
            <button
              key={ticker.symbol}
              type="button"
              className="chip rounded-full px-3 py-1 text-xs"
              aria-pressed={symbol === ticker.symbol}
              onClick={() => setSymbol(ticker.symbol)}
            >
              ${ticker.symbol}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="seg flex gap-1" role="group" aria-label="Timeframe">
          {TIMEFRAMES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="chip rounded-full px-2.5 py-1 text-xs"
              aria-pressed={frame === item.id}
              onClick={() => setFrame(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="seg flex gap-1" role="group" aria-label="Metric">
          {METRICS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="chip rounded-full px-2.5 py-1 text-xs"
              aria-pressed={metric === item.id}
              onClick={() => setMetric(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-[320px] w-full md:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.sapphire} stopOpacity={0.35} />
                <stop offset="100%" stopColor={palette.sapphire} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgb(148 162 184 / 0.2)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: palette.ink, fontSize: 11 }} minTickGap={28} />
            <YAxis
              yAxisId="price"
              orientation="right"
              tick={{ fill: palette.ink, fontSize: 11 }}
              width={48}
              domain={['auto', 'auto']}
            />
            {metric !== 'price' && (
              <YAxis yAxisId="metric" tick={{ fill: palette.ink, fontSize: 11 }} width={48} />
            )}
            <Tooltip
              content={<Crosshair />}
              cursor={{ stroke: palette.sapphire, strokeDasharray: '3 3' }}
            />
            <Area
              yAxisId={areaAxis}
              type="monotone"
              dataKey={metricDef.key}
              stroke={palette.sapphire}
              fill="url(#metricFill)"
              strokeWidth={1.6}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Customized
              component={(chartProps) => (
                <Candles
                  {...chartProps}
                  points={points}
                  up={palette.emerald}
                  down="#f45a72"
                />
              )}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
