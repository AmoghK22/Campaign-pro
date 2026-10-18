/**
 * Small, dependency-free collection helpers used by the persistence layer.
 * Kept pure so the de-duplication rule (never store two records with the same
 * id) is unit-testable without touching storage.
 */

export function upsertById<T extends { id: string }>(items: readonly T[], item: T): T[] {
  const index = items.findIndex((entry) => entry.id === item.id);
  if (index < 0) {
    return [...items, item];
  }
  const next = items.slice();
  next[index] = item;
  return next;
}

export function removeById<T extends { id: string }>(items: readonly T[], id: string): T[] {
  return items.filter((entry) => entry.id !== id);
}
