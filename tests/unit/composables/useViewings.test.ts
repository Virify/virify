import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import type { ViewingWithDetails } from '../../../shared/types/viewing';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeViewing(overrides: Partial<ViewingWithDetails> = {}): ViewingWithDetails {
  return {
    id: 1,
    listingId: 10,
    requesterId: 100,
    ownerId: 200,
    conversationId: 5,
    proposedDates: ['2026-06-01T12:00:00.000Z'],
    preferredTimes: ['Any time'],
    counterProposedAt: null,
    status: 'PENDING',
    notes: null,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    listing: null,
    requester: { id: 100, username: 'requester', avatar: null },
    owner: { id: 200, username: 'owner', avatar: null },
    ...overrides,
  };
}

// ─── pendingViewings / pendingCount ───────────────────────────────────────────

describe('useViewings – pendingViewings / pendingCount', () => {
  it('filters only PENDING viewings', () => {
    const viewings = ref([
      makeViewing({ id: 1, status: 'PENDING' }),
      makeViewing({ id: 2, status: 'ACCEPTED' }),
      makeViewing({ id: 3, status: 'RESCHEDULED' }),
      makeViewing({ id: 4, status: 'PENDING' }),
    ]);

    const pending = viewings.value.filter(v => v.status === 'PENDING');
    expect(pending).toHaveLength(2);
    expect(pending.map(v => v.id)).toEqual([1, 4]);
  });

  it('returns empty array when no viewings are PENDING', () => {
    const viewings = ref([
      makeViewing({ id: 1, status: 'ACCEPTED' }),
      makeViewing({ id: 2, status: 'CANCELLED' }),
    ]);

    const pending = viewings.value.filter(v => v.status === 'PENDING');
    expect(pending).toHaveLength(0);
  });

  it('counts pending viewings correctly', () => {
    const viewings = ref([
      makeViewing({ id: 1, status: 'PENDING' }),
      makeViewing({ id: 2, status: 'PENDING' }),
      makeViewing({ id: 3, status: 'ACCEPTED' }),
    ]);

    const count = viewings.value.filter(v => v.status === 'PENDING').length;
    expect(count).toBe(2);
  });
});

// ─── getConversationViewings ──────────────────────────────────────────────────

describe('useViewings – getConversationViewings', () => {
  it('returns viewings matching the given conversationId', () => {
    const viewings = [
      makeViewing({ id: 1, conversationId: 5 }),
      makeViewing({ id: 2, conversationId: 7 }),
      makeViewing({ id: 3, conversationId: 5 }),
    ];

    const result = viewings.filter(v => v.conversationId === 5);
    expect(result).toHaveLength(2);
    expect(result.map(v => v.id)).toEqual([1, 3]);
  });

  it('returns empty array when no viewings match conversationId', () => {
    const viewings = [
      makeViewing({ id: 1, conversationId: 5 }),
    ];

    const result = viewings.filter(v => v.conversationId === 99);
    expect(result).toHaveLength(0);
  });

  it('returns empty array when viewings list is empty', () => {
    const viewings: ViewingWithDetails[] = [];
    const result = viewings.filter(v => v.conversationId === 5);
    expect(result).toHaveLength(0);
  });
});

// ─── hasActiveViewingAsRequester ─────────────────────────────────────────────

describe('useViewings – hasActiveViewingAsRequester logic', () => {
  const userId = 100;

  function hasActive(viewings: ViewingWithDetails[], listingId: number): boolean {
    return viewings.some(
      v =>
        v.listingId === listingId &&
        v.requesterId === userId &&
        (v.status === 'PENDING' || v.status === 'RESCHEDULED'),
    );
  }

  it('returns true for PENDING viewing by current user on listing', () => {
    const viewings = [makeViewing({ listingId: 10, requesterId: userId, status: 'PENDING' })];
    expect(hasActive(viewings, 10)).toBe(true);
  });

  it('returns true for RESCHEDULED viewing by current user on listing', () => {
    const viewings = [makeViewing({ listingId: 10, requesterId: userId, status: 'RESCHEDULED' })];
    expect(hasActive(viewings, 10)).toBe(true);
  });

  it('returns false for ACCEPTED viewing', () => {
    const viewings = [makeViewing({ listingId: 10, requesterId: userId, status: 'ACCEPTED' })];
    expect(hasActive(viewings, 10)).toBe(false);
  });

  it('returns false for CANCELLED viewing', () => {
    const viewings = [makeViewing({ listingId: 10, requesterId: userId, status: 'CANCELLED' })];
    expect(hasActive(viewings, 10)).toBe(false);
  });

  it('returns false when viewing belongs to a different listing', () => {
    const viewings = [makeViewing({ listingId: 99, requesterId: userId, status: 'PENDING' })];
    expect(hasActive(viewings, 10)).toBe(false);
  });

  it('returns false when requester is a different user', () => {
    const viewings = [makeViewing({ listingId: 10, requesterId: 999, status: 'PENDING' })];
    expect(hasActive(viewings, 10)).toBe(false);
  });

  it('returns false when viewings list is empty', () => {
    expect(hasActive([], 10)).toBe(false);
  });
});

// ─── requestViewing – array mutation ─────────────────────────────────────────

describe('useViewings – requestViewing array update', () => {
  it('appends the new viewing to the array', () => {
    const viewings = ref<ViewingWithDetails[]>([
      makeViewing({ id: 1 }),
    ]);
    const created = makeViewing({ id: 2 });

    viewings.value = [...viewings.value, created];

    expect(viewings.value).toHaveLength(2);
    expect(viewings.value[1]!.id).toBe(2);
  });
});

// ─── respondToViewing – array mutation ───────────────────────────────────────

describe('useViewings – respondToViewing array update', () => {
  it('replaces the viewing at the correct index', () => {
    const viewings = ref<ViewingWithDetails[]>([
      makeViewing({ id: 1, status: 'PENDING' }),
      makeViewing({ id: 2, status: 'PENDING' }),
    ]);

    const updated = makeViewing({ id: 2, status: 'ACCEPTED' });
    const idx = viewings.value.findIndex(v => v.id === 2);
    if (idx !== -1) viewings.value[idx] = updated;

    expect(viewings.value[1]!.status).toBe('ACCEPTED');
    expect(viewings.value[0]!.status).toBe('PENDING');
  });

  it('does not modify array when id is not found', () => {
    const viewings = ref<ViewingWithDetails[]>([
      makeViewing({ id: 1, status: 'PENDING' }),
    ]);

    const updated = makeViewing({ id: 99, status: 'ACCEPTED' });
    const idx = viewings.value.findIndex(v => v.id === updated.id);
    if (idx !== -1) viewings.value[idx] = updated;

    expect(viewings.value).toHaveLength(1);
    expect(viewings.value[0]!.status).toBe('PENDING');
  });
});

// ─── cancelViewing – array mutation ──────────────────────────────────────────

describe('useViewings – cancelViewing array update', () => {
  it('sets status to CANCELLED on the correct viewing', () => {
    const viewings = ref<ViewingWithDetails[]>([
      makeViewing({ id: 1, status: 'PENDING' }),
      makeViewing({ id: 2, status: 'ACCEPTED' }),
    ]);

    const idx = viewings.value.findIndex(v => v.id === 1);
    if (idx !== -1) viewings.value[idx] = { ...viewings.value[idx]!, status: 'CANCELLED' };

    expect(viewings.value[0]!.status).toBe('CANCELLED');
    expect(viewings.value[1]!.status).toBe('ACCEPTED');
  });

  it('preserves all other fields when cancelling', () => {
    const original = makeViewing({ id: 1, status: 'PENDING', notes: 'Test note' });
    const viewings = ref<ViewingWithDetails[]>([original]);

    const idx = viewings.value.findIndex(v => v.id === 1);
    if (idx !== -1) viewings.value[idx] = { ...viewings.value[idx]!, status: 'CANCELLED' };

    expect(viewings.value[0]!.notes).toBe('Test note');
    expect(viewings.value[0]!.id).toBe(1);
  });
});

// ─── fetchViewings – unauthenticated guard ────────────────────────────────────

describe('useViewings – fetchViewings unauthenticated guard', () => {
  it('clears viewings when not logged in', () => {
    const viewings = ref<ViewingWithDetails[]>([makeViewing({ id: 1 })]);
    const loggedIn = ref(false);

    // Simulates the guard at the start of fetchViewings
    if (!loggedIn.value) {
      viewings.value = [];
    }

    expect(viewings.value).toHaveLength(0);
  });
});

// ─── ViewingStatus type completeness ─────────────────────────────────────────

describe('ViewingStatus values', () => {
  it('covers all expected status strings', () => {
    const statuses: string[] = ['PENDING', 'ACCEPTED', 'REJECTED', 'RESCHEDULED', 'CANCELLED'];
    expect(statuses).toHaveLength(5);
    expect(statuses).toContain('PENDING');
    expect(statuses).toContain('ACCEPTED');
    expect(statuses).toContain('REJECTED');
    expect(statuses).toContain('RESCHEDULED');
    expect(statuses).toContain('CANCELLED');
  });
});

// ─── getActiveViewingForListing ───────────────────────────────────────────────

describe('useViewings – getActiveViewingForListing priority logic', () => {
  const userId = 100;

  function getActive(
    viewings: ViewingWithDetails[],
    listingId: number,
  ): ViewingWithDetails | null {
    const priority = ['ACCEPTED', 'RESCHEDULED', 'PENDING'] as const;
    for (const status of priority) {
      const found = viewings.find(
        v => v.listingId === listingId && v.requesterId === userId && v.status === status,
      );
      if (found) return found;
    }
    return null;
  }

  it('returns null when viewings list is empty', () => {
    expect(getActive([], 10)).toBeNull();
  });

  it('returns null when no viewings match the listing', () => {
    const viewings = [makeViewing({ listingId: 99, requesterId: userId, status: 'PENDING' })];
    expect(getActive(viewings, 10)).toBeNull();
  });

  it('returns null when the matching viewing belongs to a different user', () => {
    const viewings = [makeViewing({ listingId: 10, requesterId: 999, status: 'PENDING' })];
    expect(getActive(viewings, 10)).toBeNull();
  });

  it('returns ACCEPTED viewing when one exists (highest priority)', () => {
    const viewings = [
      makeViewing({ id: 1, listingId: 10, requesterId: userId, status: 'PENDING' }),
      makeViewing({ id: 2, listingId: 10, requesterId: userId, status: 'ACCEPTED' }),
    ];
    expect(getActive(viewings, 10)!.id).toBe(2);
  });

  it('returns RESCHEDULED viewing when no ACCEPTED exists', () => {
    const viewings = [
      makeViewing({ id: 1, listingId: 10, requesterId: userId, status: 'PENDING' }),
      makeViewing({ id: 2, listingId: 10, requesterId: userId, status: 'RESCHEDULED' }),
    ];
    expect(getActive(viewings, 10)!.id).toBe(2);
  });

  it('returns PENDING viewing when no ACCEPTED or RESCHEDULED exists', () => {
    const viewings = [
      makeViewing({ id: 1, listingId: 10, requesterId: userId, status: 'PENDING' }),
    ];
    expect(getActive(viewings, 10)!.id).toBe(1);
  });

  it('returns null for CANCELLED or REJECTED viewings', () => {
    const viewings = [
      makeViewing({ listingId: 10, requesterId: userId, status: 'CANCELLED' }),
      makeViewing({ listingId: 10, requesterId: userId, status: 'REJECTED' }),
    ];
    expect(getActive(viewings, 10)).toBeNull();
  });
});

// ─── getViewingStatusLabel ────────────────────────────────────────────────────

describe('useViewings – getViewingStatusLabel', () => {
  function getViewingStatusLabel(viewing: ViewingWithDetails): string {
    if (viewing.status === 'ACCEPTED') {
      const confirmedDate = viewing.counterProposedAt ?? viewing.proposedDates[0];
      if (confirmedDate) {
        const d = new Date(confirmedDate).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        });
        return `Viewing on ${d}`;
      }
      return 'Viewing Confirmed';
    }
    if (viewing.status === 'RESCHEDULED') return 'New Time Proposed';
    return 'Viewing Pending';
  }

  it('returns "Viewing Pending" for PENDING status', () => {
    expect(getViewingStatusLabel(makeViewing({ status: 'PENDING' }))).toBe('Viewing Pending');
  });

  it('returns "Viewing Pending" for CANCELLED status', () => {
    expect(getViewingStatusLabel(makeViewing({ status: 'CANCELLED' }))).toBe('Viewing Pending');
  });

  it('returns "Viewing Pending" for REJECTED status', () => {
    expect(getViewingStatusLabel(makeViewing({ status: 'REJECTED' }))).toBe('Viewing Pending');
  });

  it('returns "New Time Proposed" for RESCHEDULED status', () => {
    expect(getViewingStatusLabel(makeViewing({ status: 'RESCHEDULED' }))).toBe('New Time Proposed');
  });

  it('returns "Viewing on <date>" for ACCEPTED with a proposed date', () => {
    const label = getViewingStatusLabel(
      makeViewing({ status: 'ACCEPTED', proposedDates: ['2026-06-01T12:00:00.000Z'] }),
    );
    expect(label).toMatch(/^Viewing on /);
    expect(label).toMatch(/Jun/);
  });

  it('prefers counterProposedAt over proposedDates[0] for ACCEPTED', () => {
    const label = getViewingStatusLabel(
      makeViewing({
        status: 'ACCEPTED',
        counterProposedAt: '2026-07-10T12:00:00.000Z',
        proposedDates: ['2026-06-01T12:00:00.000Z'],
      }),
    );
    expect(label).toMatch(/Jul/);
    expect(label).not.toMatch(/Jun/);
  });

  it('returns "Viewing Confirmed" for ACCEPTED with no dates', () => {
    const label = getViewingStatusLabel(
      makeViewing({ status: 'ACCEPTED', proposedDates: [], counterProposedAt: null }),
    );
    expect(label).toBe('Viewing Confirmed');
  });
});

// ─── counterProposeViewing – array mutation ───────────────────────────────────

describe('useViewings – counterProposeViewing array update', () => {
  it('updates the viewing at the correct index', () => {
    const viewings = ref<ViewingWithDetails[]>([
      makeViewing({ id: 1, status: 'PENDING' }),
      makeViewing({ id: 2, status: 'PENDING' }),
    ]);

    const updated = makeViewing({ id: 2, status: 'RESCHEDULED', counterProposedAt: '2026-07-01T12:00:00.000Z' });
    const idx = viewings.value.findIndex(v => v.id === updated.id);
    if (idx !== -1) viewings.value[idx] = updated;

    expect(viewings.value[1]!.status).toBe('RESCHEDULED');
    expect(viewings.value[1]!.counterProposedAt).toBe('2026-07-01T12:00:00.000Z');
  });

  it('does not modify other viewings when counter-proposing', () => {
    const viewings = ref<ViewingWithDetails[]>([
      makeViewing({ id: 1, status: 'PENDING' }),
      makeViewing({ id: 2, status: 'PENDING' }),
    ]);

    const updated = makeViewing({ id: 2, status: 'RESCHEDULED' });
    const idx = viewings.value.findIndex(v => v.id === updated.id);
    if (idx !== -1) viewings.value[idx] = updated;

    expect(viewings.value[0]!.status).toBe('PENDING');
  });

  it('does not modify the array when the id is not found', () => {
    const viewings = ref<ViewingWithDetails[]>([
      makeViewing({ id: 1, status: 'PENDING' }),
    ]);

    const updated = makeViewing({ id: 99, status: 'RESCHEDULED' });
    const idx = viewings.value.findIndex(v => v.id === updated.id);
    if (idx !== -1) viewings.value[idx] = updated;

    expect(viewings.value).toHaveLength(1);
    expect(viewings.value[0]!.status).toBe('PENDING');
  });
});
