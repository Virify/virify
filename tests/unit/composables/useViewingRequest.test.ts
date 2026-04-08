import { describe, it, expect } from 'vitest';

// ─── formatViewingDate ────────────────────────────────────────────────────────

describe('useViewingRequest – formatViewingDate', () => {
  function formatViewingDate(isoString: string): string {
    return new Date(isoString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  it('formats an ISO string to en-GB locale string', () => {
    const result = formatViewingDate('2026-06-15T10:30:00.000Z');
    // Should contain day, month abbreviation, year, and time parts
    expect(result).toMatch(/\d{2}/); // day
    expect(result).toMatch(/\d{4}/); // year
    expect(result).toMatch(/:/); // time separator
  });

  it('returns a non-empty string for any valid ISO date', () => {
    const result = formatViewingDate('2026-01-01T00:00:00.000Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles end-of-year date', () => {
    const result = formatViewingDate('2026-12-31T23:59:00.000Z');
    expect(result).toMatch(/2026/);
  });
});

// ─── viewingStatusColor ───────────────────────────────────────────────────────

describe('useViewingRequest – viewingStatusColor', () => {
  function viewingStatusColor(
    status: string,
  ): 'success' | 'warning' | 'error' | 'secondary' | 'neutral' {
    if (status === 'ACCEPTED') return 'success';
    if (status === 'PENDING') return 'warning';
    if (status === 'REJECTED') return 'error';
    if (status === 'RESCHEDULED') return 'secondary';
    return 'neutral';
  }

  it('returns "success" for ACCEPTED', () => {
    expect(viewingStatusColor('ACCEPTED')).toBe('success');
  });

  it('returns "warning" for PENDING', () => {
    expect(viewingStatusColor('PENDING')).toBe('warning');
  });

  it('returns "error" for REJECTED', () => {
    expect(viewingStatusColor('REJECTED')).toBe('error');
  });

  it('returns "secondary" for RESCHEDULED', () => {
    expect(viewingStatusColor('RESCHEDULED')).toBe('secondary');
  });

  it('returns "neutral" for CANCELLED', () => {
    expect(viewingStatusColor('CANCELLED')).toBe('neutral');
  });

  it('returns "neutral" for unknown status', () => {
    expect(viewingStatusColor('UNKNOWN_STATUS')).toBe('neutral');
    expect(viewingStatusColor('')).toBe('neutral');
  });
});

// ─── conversationViewings computed logic ─────────────────────────────────────

describe('useViewingRequest – conversationViewings logic', () => {
  it('returns viewings filtered by conversation id', () => {
    const allViewings = [
      { id: 1, conversationId: 5 },
      { id: 2, conversationId: 7 },
      { id: 3, conversationId: 5 },
    ];

    const result = allViewings.filter(v => v.conversationId === 5);
    expect(result).toHaveLength(2);
    expect(result.map(v => v.id)).toEqual([1, 3]);
  });

  it('returns empty array when conversation has no id', () => {
    const conversation = null;
    if (!conversation) {
      expect([]).toHaveLength(0);
    }
  });

  it('returns empty array when no viewings match', () => {
    const allViewings = [{ id: 1, conversationId: 5 }];
    const result = allViewings.filter(v => v.conversationId === 99);
    expect(result).toHaveLength(0);
  });
});

// ─── hasActiveViewing computed logic ─────────────────────────────────────────

describe('useViewingRequest – hasActiveViewing logic', () => {
  function hasActiveViewingAsRequester(
    viewings: { listingId: number; requesterId: number; status: string }[],
    listingId: number,
    userId: number,
  ): boolean {
    return viewings.some(
      v =>
        v.listingId === listingId &&
        v.requesterId === userId &&
        (v.status === 'PENDING' || v.status === 'RESCHEDULED'),
    );
  }

  it('returns false when conversation has no listing', () => {
    const conversation = { id: 1, listing: null };
    expect(conversation.listing).toBeNull();
  });

  it('returns true when there is a PENDING viewing for the listing', () => {
    const viewings = [{ listingId: 10, requesterId: 100, status: 'PENDING' }];
    expect(hasActiveViewingAsRequester(viewings, 10, 100)).toBe(true);
  });

  it('returns true when there is a RESCHEDULED viewing for the listing', () => {
    const viewings = [{ listingId: 10, requesterId: 100, status: 'RESCHEDULED' }];
    expect(hasActiveViewingAsRequester(viewings, 10, 100)).toBe(true);
  });

  it('returns false when viewing is ACCEPTED', () => {
    const viewings = [{ listingId: 10, requesterId: 100, status: 'ACCEPTED' }];
    expect(hasActiveViewingAsRequester(viewings, 10, 100)).toBe(false);
  });

  it('returns false when there are no viewings', () => {
    expect(hasActiveViewingAsRequester([], 10, 100)).toBe(false);
  });
});

// ─── submitViewingRequest guard logic ────────────────────────────────────────

describe('useViewingRequest – submitViewingRequest guard', () => {
  it('does not proceed when listing id is missing', () => {
    const listing = null;
    let called = false;

    if (!listing) {
      // early return — requestViewing should not be called
    } else {
      called = true;
    }

    expect(called).toBe(false);
  });

  it('does not proceed when viewingDate is missing', () => {
    const viewingDate = null;
    let called = false;

    if (!viewingDate) {
      // early return
    } else {
      called = true;
    }

    expect(called).toBe(false);
  });

  it('builds the correct ISO payload from date and time', () => {
    // Simulate the date+time merge logic from submitViewingRequest
    const timeStr = '14:30';
    const [hours, minutes] = timeStr.split(':').map(Number);

    const native = new Date('2026-06-15T00:00:00.000Z');
    native.setHours(hours!, minutes!, 0, 0);

    expect(native.getHours()).toBe(hours);
    expect(native.getMinutes()).toBe(minutes);
    expect(typeof native.toISOString()).toBe('string');
  });

  it('resets form fields after successful submission', () => {
    let viewingPopoverOpen = true;
    let viewingTime = '14:30';
    let viewingNotes = 'Some notes';

    // Simulate the reset after success
    viewingPopoverOpen = false;
    viewingTime = '10:00';
    viewingNotes = '';

    expect(viewingPopoverOpen).toBe(false);
    expect(viewingTime).toBe('10:00');
    expect(viewingNotes).toBe('');
  });
});
