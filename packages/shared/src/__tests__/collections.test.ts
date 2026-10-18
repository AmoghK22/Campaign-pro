import { describe, expect, it } from 'vitest';
import { removeById, upsertById } from '../collections';

interface Row {
  id: string;
  value: number;
}

describe('upsertById', () => {
  it('appends a new record without mutating the input', () => {
    const items: Row[] = [{ id: 'a', value: 1 }];
    const next = upsertById(items, { id: 'b', value: 2 });
    expect(next.map((row) => row.id)).toEqual(['a', 'b']);
    expect(items).toHaveLength(1);
  });

  it('updates an existing record in place instead of duplicating it', () => {
    const items: Row[] = [
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
    ];
    const next = upsertById(items, { id: 'a', value: 99 });
    expect(next).toHaveLength(2);
    expect(next.find((row) => row.id === 'a')?.value).toBe(99);
  });

  it('never produces duplicates across repeated upserts of the same id', () => {
    let items: Row[] = [];
    for (let i = 0; i < 5; i += 1) {
      items = upsertById(items, { id: 'same', value: i });
    }
    expect(items).toHaveLength(1);
    expect(items[0]?.value).toBe(4);
  });
});

describe('removeById', () => {
  it('removes only the matching record', () => {
    const items: Row[] = [
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
    ];
    expect(removeById(items, 'a').map((row) => row.id)).toEqual(['b']);
    expect(removeById(items, 'missing')).toHaveLength(2);
  });
});
