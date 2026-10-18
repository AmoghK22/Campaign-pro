const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrFormatterPaise = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats whole-rupee amounts for display, e.g. ₹1,20,000. */
export function formatINR(value: number, options: { withPaise?: boolean } = {}): string {
  const safe = Number.isFinite(value) ? value : 0;
  return options.withPaise ? inrFormatterPaise.format(safe) : inrFormatter.format(Math.round(safe));
}

export function formatImpressions(value: number): string {
  const safe = Number.isFinite(value) ? Math.round(value) : 0;
  return new Intl.NumberFormat('en-IN').format(safe);
}

export function formatPercent(fraction: number): string {
  const safe = Number.isFinite(fraction) ? fraction : 0;
  return `${Math.round(safe * 100)}%`;
}

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** Formats an ISO date for display, e.g. `1 Dec 2026`. Returns '' if invalid. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) {
    return '';
  }
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return dateFormatter.format(parsed);
}

/** Formats an ISO date and time, e.g. `1 Dec 2026, 14:30`. Returns '' if invalid. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) {
    return '';
  }
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  const hh = String(parsed.getHours()).padStart(2, '0');
  const mm = String(parsed.getMinutes()).padStart(2, '0');
  return `${dateFormatter.format(parsed)}, ${hh}:${mm}`;
}
