export function fuzzyScore(query, text) {
  const q = String(query || '').toLowerCase().trim();
  const t = String(text || '').toLowerCase();
  if (!q) return 1;
  if (t.includes(q)) return t.startsWith(q) ? 3 : 2;
  let index = 0;
  for (const char of t) {
    if (char === q[index]) index += 1;
    if (index === q.length) return 1;
  }
  return 0;
}

export function bestFuzzyScore(query, fields) {
  return fields.reduce((best, field) => Math.max(best, fuzzyScore(query, field)), 0);
}
