import { TICKERS } from '@/data/fixtures';

const BASE = { APEX: 184, AURA: 96, TWIN: 142, SOLR: 121 };
const WEEKS = 260;
const START = Date.UTC(2021, 0, 4);

export const TIMEFRAMES = [
  { id: '1M', label: '1M', weeks: 4 },
  { id: '6M', label: '6M', weeks: 26 },
  { id: '1Y', label: '1Y', weeks: 52 },
  { id: '5Y', label: '5Y', weeks: 260 },
  { id: 'MAX', label: 'MAX', weeks: 260 },
];

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function build(symbol) {
  const rand = mulberry32(
    symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0) * 97, 1200)
  );
  let price = BASE[symbol] || 100;
  const points = [];
  for (let i = 0; i < WEEKS; i += 1) {
    const open = price;
    const drift = (rand() - 0.47) * open * 0.035;
    let close = Math.max(12, open + drift);
    let high = Math.max(open, close) * (1 + rand() * 0.018);
    let low = Math.min(open, close) * (1 - rand() * 0.018);
    if (low > Math.min(open, close)) low = Math.min(open, close);
    if (high < Math.max(open, close)) high = Math.max(open, close);
    points.push({
      date: new Date(START + i * 7 * 86400000).toISOString().slice(0, 10),
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
      volume: Math.round(800 + rand() * 5200),
      yieldPct: round(3.1 + rand() * 4.4),
      spread: round(high - low),
    });
    price = close;
  }

  const published = TICKERS.find((ticker) => ticker.symbol === symbol);
  if (published && points.length > 1) {
    const prev = points[points.length - 2].close;
    const nextClose = round(prev * (1 + published.change / 100));
    const last = points[points.length - 1];
    last.open = prev;
    last.close = nextClose;
    last.high = round(Math.max(prev, nextClose) * 1.008);
    last.low = round(Math.min(prev, nextClose) * 0.992);
    last.spread = round(last.high - last.low);
  }
  return points;
}

const CACHE = {};

export function seriesFor(symbol) {
  if (!CACHE[symbol]) CACHE[symbol] = build(symbol);
  return CACHE[symbol];
}

export function sliceSeries(symbol, timeframe) {
  const all = seriesFor(symbol);
  const frame = TIMEFRAMES.find((item) => item.id === timeframe) || TIMEFRAMES[2];
  return all.slice(-frame.weeks);
}
