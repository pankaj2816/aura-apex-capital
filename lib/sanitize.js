const HOSTILE = /<|>|<\/|script\b|javascript:|onerror\b|onload\b/i;

export function isHostile(value) {
  return HOSTILE.test(String(value ?? ''));
}

export function toPlainText(value, max = 240) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function allowOne(value, allowed, fallback) {
  const text = String(value ?? '');
  return allowed.includes(text) ? text : fallback;
}

export function readBoundNumber(value, min, max, fallback) {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}
