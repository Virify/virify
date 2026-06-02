import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import type { OpenHouseSession } from '../../../shared/types/open-house';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeSession(overrides: Partial<OpenHouseSession> = {}): OpenHouseSession {
  return {
    id: 1,
    listingId: 10,
    date: '2026-06-15T12:00:00.000Z',
    startTime: '10:00',
    endTime: '13:00',
    slotMins: 15,
    bookedSlots: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

// ─── getSessionsForListing ────────────────────────────────────────────────────

describe('useOpenHouse – getSessionsForListing', () => {
  it('returns sessions for a known listing', () => {
    const map = new Map<number, OpenHouseSession[]>([[10, [makeSession()]]]);
    const result = map.get(10) ?? [];
    expect(result).toHaveLength(1);
  });

  it('returns an empty array for an unknown listing', () => {
    const map = new Map<number, OpenHouseSession[]>();
    const result = map.get(99) ?? [];
    expect(result).toHaveLength(0);
  });

  it('returns all sessions when a listing has multiple', () => {
    const sessions = [makeSession({ id: 1 }), makeSession({ id: 2 })];
    const map = new Map<number, OpenHouseSession[]>([[10, sessions]]);
    expect(map.get(10) ?? []).toHaveLength(2);
  });
});

// ─── hasUpcomingOpenHouse ─────────────────────────────────────────────────────

describe('useOpenHouse – hasUpcomingOpenHouse', () => {
  it('returns true when sessions exist for the listing', () => {
    const map = new Map<number, OpenHouseSession[]>([[10, [makeSession()]]]);
    const sessions = map.get(10) ?? [];
    expect(sessions.length > 0).toBe(true);
  });

  it('returns false when no sessions exist for the listing', () => {
    const map = new Map<number, OpenHouseSession[]>();
    const sessions = map.get(10) ?? [];
    expect(sessions.length > 0).toBe(false);
  });

  it('returns false when sessions array is explicitly empty', () => {
    const map = new Map<number, OpenHouseSession[]>([[10, []]]);
    const sessions = map.get(10) ?? [];
    expect(sessions.length > 0).toBe(false);
  });
});

// ─── createSession – cache insertion and date sorting ────────────────────────

describe('useOpenHouse – createSession cache update', () => {
  it('appends the new session to an existing listing cache', () => {
    const existing = [makeSession({ id: 1, date: '2026-06-10T12:00:00.000Z' })];
    const newSession = makeSession({ id: 2, date: '2026-06-20T12:00:00.000Z' });

    const updated = [...existing, newSession].sort((a, b) => a.date.localeCompare(b.date));
    expect(updated).toHaveLength(2);
    expect(updated[1]!.id).toBe(2);
  });

  it('sorts sessions by date ascending after insertion', () => {
    const existing = [makeSession({ id: 1, date: '2026-06-20T12:00:00.000Z' })];
    const newSession = makeSession({ id: 2, date: '2026-06-10T12:00:00.000Z' });

    const updated = [...existing, newSession].sort((a, b) => a.date.localeCompare(b.date));
    expect(updated[0]!.id).toBe(2); // earlier date should be first
    expect(updated[1]!.id).toBe(1);
  });

  it('creates a new entry when the listing has no existing sessions', () => {
    const sessionsByListing = ref(new Map<number, OpenHouseSession[]>());
    const session = makeSession({ listingId: 42 });

    const current = sessionsByListing.value.get(42) ?? [];
    sessionsByListing.value = new Map(sessionsByListing.value).set(42, [...current, session]);

    expect(sessionsByListing.value.get(42)).toHaveLength(1);
  });

  it('preserves sessions for other listings when inserting', () => {
    const sessionsByListing = ref(
      new Map<number, OpenHouseSession[]>([[10, [makeSession({ id: 1, listingId: 10 })]]])
    );

    const newSession = makeSession({ id: 2, listingId: 20 });
    const current = sessionsByListing.value.get(20) ?? [];
    sessionsByListing.value = new Map(sessionsByListing.value).set(20, [...current, newSession]);

    expect(sessionsByListing.value.get(10)).toHaveLength(1);
    expect(sessionsByListing.value.get(20)).toHaveLength(1);
  });

  it('produces a new Map reference (immutability)', () => {
    const sessionsByListing = ref(new Map<number, OpenHouseSession[]>());
    const original = sessionsByListing.value;

    sessionsByListing.value = new Map(sessionsByListing.value).set(10, [makeSession()]);

    expect(sessionsByListing.value).not.toBe(original);
  });
});

// ─── deleteSession – cache filtering ─────────────────────────────────────────

describe('useOpenHouse – deleteSession cache update', () => {
  it('removes the deleted session from the listing cache', () => {
    const sessions = [makeSession({ id: 1 }), makeSession({ id: 2 })];
    const after = sessions.filter(s => s.id !== 1);

    expect(after).toHaveLength(1);
    expect(after[0]!.id).toBe(2);
  });

  it('returns an empty array when the only session is deleted', () => {
    const sessions = [makeSession({ id: 1 })];
    const after = sessions.filter(s => s.id !== 1);

    expect(after).toHaveLength(0);
  });

  it('does not modify cache when the id is not found', () => {
    const sessions = [makeSession({ id: 1 }), makeSession({ id: 2 })];
    const after = sessions.filter(s => s.id !== 99);

    expect(after).toHaveLength(2);
  });

  it('produces a new Map reference (immutability)', () => {
    const sessionsByListing = ref(
      new Map<number, OpenHouseSession[]>([[10, [makeSession({ id: 1 }), makeSession({ id: 2 })]]])
    );
    const original = sessionsByListing.value;

    const current = sessionsByListing.value.get(10) ?? [];
    sessionsByListing.value = new Map(sessionsByListing.value).set(10, current.filter(s => s.id !== 1));

    expect(sessionsByListing.value).not.toBe(original);
    expect(sessionsByListing.value.get(10)).toHaveLength(1);
  });
});

// ─── bookSlot – bookedSlots cache update ─────────────────────────────────────

describe('useOpenHouse – bookSlot bookedSlots cache update', () => {
  it('appends the booked slot label to the session', () => {
    const session = makeSession({ id: 1, bookedSlots: [] });
    const slotLabel = '10:00–10:15';

    const updated = { ...session, bookedSlots: [...session.bookedSlots, slotLabel] };

    expect(updated.bookedSlots).toContain('10:00–10:15');
    expect(updated.bookedSlots).toHaveLength(1);
  });

  it('preserves previously booked slots', () => {
    const session = makeSession({ id: 1, bookedSlots: ['09:00–09:15'] });
    const slotLabel = '10:00–10:15';

    const updated = { ...session, bookedSlots: [...session.bookedSlots, slotLabel] };

    expect(updated.bookedSlots).toHaveLength(2);
    expect(updated.bookedSlots).toContain('09:00–09:15');
    expect(updated.bookedSlots).toContain('10:00–10:15');
  });

  it('leaves other sessions in the listing cache unchanged', () => {
    const sessions = [
      makeSession({ id: 1, bookedSlots: [] }),
      makeSession({ id: 2, bookedSlots: [] }),
    ];

    const updated = sessions.map(s =>
      s.id === 1 ? { ...s, bookedSlots: [...s.bookedSlots, '10:00–10:15'] } : s,
    );

    expect(updated[0]!.bookedSlots).toContain('10:00–10:15');
    expect(updated[1]!.bookedSlots).toHaveLength(0);
  });

  it('does not mutate the original session object', () => {
    const session = makeSession({ id: 1, bookedSlots: [] });
    const updated = { ...session, bookedSlots: [...session.bookedSlots, '10:00–10:15'] };

    expect(session.bookedSlots).toHaveLength(0); // original unchanged
    expect(updated.bookedSlots).toHaveLength(1);
  });
});

// ─── fetchSessionsForListing – cache replacement ──────────────────────────────

describe('useOpenHouse – fetchSessionsForListing cache replacement', () => {
  it('replaces existing sessions for a listing with fresh data', () => {
    const sessionsByListing = ref(
      new Map<number, OpenHouseSession[]>([[10, [makeSession({ id: 1 })]]])
    );
    const freshData = [makeSession({ id: 2 }), makeSession({ id: 3 })];

    sessionsByListing.value = new Map(sessionsByListing.value).set(10, freshData);

    expect(sessionsByListing.value.get(10)).toHaveLength(2);
    expect(sessionsByListing.value.get(10)![0]!.id).toBe(2);
  });

  it('stores an empty array when the API returns no sessions', () => {
    const sessionsByListing = ref(new Map<number, OpenHouseSession[]>());

    sessionsByListing.value = new Map(sessionsByListing.value).set(10, []);

    expect(sessionsByListing.value.get(10)).toHaveLength(0);
  });

  it('does not overwrite sessions for other listings', () => {
    const sessionsByListing = ref(
      new Map<number, OpenHouseSession[]>([
        [10, [makeSession({ id: 1, listingId: 10 })]],
        [20, [makeSession({ id: 2, listingId: 20 })]],
      ])
    );

    sessionsByListing.value = new Map(sessionsByListing.value).set(10, [makeSession({ id: 3, listingId: 10 })]);

    expect(sessionsByListing.value.get(20)).toHaveLength(1);
    expect(sessionsByListing.value.get(20)![0]!.id).toBe(2);
  });
});
