export function readAmount(raw, fallback, min, max) {
  if (raw === '' || raw === null || raw === undefined) {
    return { value: fallback, warning: '' };
  }
  const cleaned = String(raw).replace(/[$,\s]/g, '');
  if (!cleaned || cleaned === '-' || cleaned === '.' || cleaned === '-.') {
    return {
      value: fallback,
      warning: 'Enter a number. A safe value is in place.',
    };
  }
  const n = Number(cleaned);
  if (!Number.isFinite(n)) {
    return {
      value: fallback,
      warning: 'Enter a number. A safe value is in place.',
    };
  }
  if (n < min || n > max) {
    return {
      value: Math.min(max, Math.max(min, n)),
      warning: 'That figure was clamped to the desk range.',
    };
  }
  return { value: n, warning: '' };
}

export function mortgagePayment({ principal, annualRatePercent, years }) {
  const loan = Number.isFinite(principal) ? Math.max(0, principal) : 0;
  const termYears = Number.isFinite(years) ? years : 0;
  const months = Math.round(termYears * 12);
  if (loan === 0 || months <= 0) return 0;

  const annual = Number.isFinite(annualRatePercent) ? annualRatePercent : 0;
  const monthlyRate = annual / 100 / 12;
  if (monthlyRate === 0) return loan / months;

  const growth = Math.pow(1 + monthlyRate, months);
  if (!Number.isFinite(growth) || growth === 1) return loan / months;

  const denominator = growth - 1;
  if (denominator === 0) return 0;

  const payment = (loan * monthlyRate * growth) / denominator;
  return Number.isFinite(payment) ? payment : 0;
}

export function distributionYield(price, annualDistribution) {
  if (!Number.isFinite(price) || price <= 0) return 0;
  if (!Number.isFinite(annualDistribution) || annualDistribution <= 0) return 0;
  const yieldPct = (annualDistribution / price) * 100;
  return Number.isFinite(yieldPct) ? yieldPct : 0;
}
