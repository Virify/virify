import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// ─── Auth guard setup ────────────────────────────────────────────────────────
let capturedHandler: ((event: unknown) => Promise<unknown>) | undefined;

vi.stubGlobal('defineEventHandler', (fn: (event: unknown) => Promise<unknown>) => {
  capturedHandler = fn;
});

const mockRequireUserSession = vi.fn();
vi.stubGlobal('requireUserSession', mockRequireUserSession);

const mockCreateError = vi.fn().mockImplementation((opts: { statusCode: number; statusMessage: string }) =>
  Object.assign(new Error(opts.statusMessage), opts),
);
vi.stubGlobal('createError', mockCreateError);

const mockIsAdmin = vi.fn();
vi.stubGlobal('isAdmin', mockIsAdmin);

vi.stubGlobal('prisma', {});

beforeAll(async () => {
  await import('../server/api/admin/engagement/index.get');
});

beforeEach(() => {
  vi.clearAllMocks();
  mockCreateError.mockImplementation((opts: { statusCode: number; statusMessage: string }) =>
    Object.assign(new Error(opts.statusMessage), opts),
  );
});

// ─── Auth guard ──────────────────────────────────────────────────────────────
describe('GET /api/admin/engagement — auth guard', () => {
  it('throws 403 when the user is not an admin', async () => {
    mockRequireUserSession.mockResolvedValue({ user: { id: 1, role: 'USER' } });
    mockIsAdmin.mockReturnValue(false);
    await expect(capturedHandler!({})).rejects.toMatchObject({ statusCode: 403 });
  });
});

// ─── CTR calculation ──────────────────────────────────────────────────────────
// Mirrors the CTR formula from the endpoint exactly.
function calcCtr(clickedImpressions: number, totalImpressions: number) {
  return totalImpressions > 0
    ? Math.round((clickedImpressions / totalImpressions) * 10000) / 100
    : 0;
}

describe('CTR calculation', () => {
  it('calculates as a percentage rounded to two decimal places', () => {
    expect(calcCtr(155, 1000)).toBe(15.5);
  });

  it('returns 0 when there are no impressions', () => {
    expect(calcCtr(0, 0)).toBe(0);
  });

  it('returns 0 when no impressions are clicked but total > 0', () => {
    expect(calcCtr(0, 500)).toBe(0);
  });

  it('returns 100 when all impressions are clicked', () => {
    expect(calcCtr(200, 200)).toBe(100);
  });

  it('rounds correctly at the second decimal place', () => {
    // 1 / 3 = 33.3333… → rounds to 33.33
    expect(calcCtr(1, 3)).toBe(33.33);
  });
});

// ─── topCtrListings derivation ────────────────────────────────────────────────
// Mirrors the map → filter → sort → slice pipeline from the endpoint.
type CtrRaw = { listingId: number; _sum: { clicks: number | null; impressions: number | null } };

function deriveTopCtrListings(raw: CtrRaw[]) {
  return raw
    .filter((r) => (r._sum.impressions ?? 0) > 0)
    .map((r) => ({
      listingId: r.listingId,
      clicks: r._sum.clicks ?? 0,
      impressions: r._sum.impressions ?? 0,
      ctr: Math.round(((r._sum.clicks ?? 0) / (r._sum.impressions ?? 1)) * 10000) / 100,
    }))
    .sort((a, b) => b.ctr - a.ctr)
    .slice(0, 10);
}

describe('topCtrListings derivation', () => {
  it('calculates CTR per listing correctly', () => {
    const raw: CtrRaw[] = [{ listingId: 1, _sum: { clicks: 50, impressions: 200 } }];
    const result = deriveTopCtrListings(raw);
    expect(result[0].ctr).toBe(25);
  });

  it('sorts listings by CTR descending', () => {
    const raw: CtrRaw[] = [
      { listingId: 1, _sum: { clicks: 10, impressions: 100 } },  // 10%
      { listingId: 2, _sum: { clicks: 50, impressions: 100 } },  // 50%
      { listingId: 3, _sum: { clicks: 25, impressions: 100 } },  // 25%
    ];
    const ids = deriveTopCtrListings(raw).map((r) => r.listingId);
    expect(ids).toEqual([2, 3, 1]);
  });

  it('filters out listings with zero impressions', () => {
    const raw: CtrRaw[] = [
      { listingId: 1, _sum: { clicks: 0, impressions: 0 } },
      { listingId: 2, _sum: { clicks: 5, impressions: 100 } },
    ];
    const result = deriveTopCtrListings(raw);
    expect(result.map((r) => r.listingId)).toEqual([2]);
  });

  it('limits the result to 10 listings', () => {
    const raw: CtrRaw[] = Array.from({ length: 15 }, (_, i) => ({
      listingId: i + 1,
      _sum: { clicks: i + 1, impressions: 100 },
    }));
    expect(deriveTopCtrListings(raw)).toHaveLength(10);
  });

  it('handles null click/impression values gracefully', () => {
    const raw: CtrRaw[] = [{ listingId: 1, _sum: { clicks: null, impressions: 50 } }];
    const result = deriveTopCtrListings(raw);
    expect(result[0].clicks).toBe(0);
    expect(result[0].ctr).toBe(0);
  });
});
