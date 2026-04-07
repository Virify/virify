import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// ─── Auth guard setup ────────────────────────────────────────────────────────
// Stub Nitro globals BEFORE any module import so the handler is captured when
// the endpoint module is first evaluated.

let capturedHandler: ((event: unknown) => Promise<unknown>) | undefined;

vi.stubGlobal('defineEventHandler', (fn: (event: unknown) => Promise<unknown>) => {
  capturedHandler = fn;
});

const mockRequireUserSession = vi.fn();
vi.stubGlobal('requireUserSession', mockRequireUserSession);

const mockCreateError = vi.fn().mockImplementation((opts: { statusCode: number; statusMessage: string }) => {
  const err = Object.assign(new Error(opts.statusMessage), opts);
  return err;
});
vi.stubGlobal('createError', mockCreateError);

const mockIsAdmin = vi.fn();
vi.stubGlobal('isAdmin', mockIsAdmin);

// Prisma is not reached when the auth guard throws, so an empty stub is fine.
vi.stubGlobal('prisma', {});

// ─── Module import ──────────────────────────────────────────────────────────
beforeAll(async () => {
  await import('../server/api/admin/search/index.get');
});

beforeEach(() => {
  vi.clearAllMocks();
  mockCreateError.mockImplementation((opts: { statusCode: number; statusMessage: string }) =>
    Object.assign(new Error(opts.statusMessage), opts),
  );
});

// ─── Auth guard ──────────────────────────────────────────────────────────────
describe('GET /api/admin/search — auth guard', () => {
  it('throws 403 when the user is not an admin', async () => {
    mockRequireUserSession.mockResolvedValue({ user: { id: 1, role: 'USER' } });
    mockIsAdmin.mockReturnValue(false);
    await expect(capturedHandler!({})).rejects.toMatchObject({ statusCode: 403 });
  });
});

// ─── radiusHistogram aggregation ─────────────────────────────────────────────
// The handler receives raw findMany rows and collapses them into a sorted map.
// This mirrors the exact algorithm in the endpoint.
function buildRadiusHistogram(rows: { radius: number; count: number }[]) {
  const map = new Map<number, number>();
  for (const s of rows) {
    map.set(s.radius, (map.get(s.radius) ?? 0) + s.count);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([radiusMiles, count]) => ({ radiusMiles, count }));
}

describe('radiusHistogram aggregation', () => {
  it('groups rows with the same radius by summing their counts', () => {
    const rows = [
      { radius: 10, count: 4 },
      { radius: 10, count: 2 },
      { radius: 40, count: 6 },
    ];
    expect(buildRadiusHistogram(rows)).toEqual([
      { radiusMiles: 10, count: 6 },
      { radiusMiles: 40, count: 6 },
    ]);
  });

  it('returns rows sorted by radius ascending', () => {
    const rows = [
      { radius: 40, count: 1 },
      { radius: 5, count: 3 },
      { radius: 20, count: 2 },
    ];
    const result = buildRadiusHistogram(rows);
    expect(result.map((r) => r.radiusMiles)).toEqual([5, 20, 40]);
  });

  it('returns an empty array for no rows', () => {
    expect(buildRadiusHistogram([])).toEqual([]);
  });

  it('handles a single unique radius correctly', () => {
    const rows = [{ radius: 10, count: 5 }];
    expect(buildRadiusHistogram(rows)).toEqual([{ radiusMiles: 10, count: 5 }]);
  });
});

// ─── totals null-coalesce ─────────────────────────────────────────────────────
describe('totals null-coalesce', () => {
  it('returns 0 for allTime when aggregate _sum.count is null', () => {
    const aggregate = { _sum: { count: null } };
    const allTime = aggregate._sum.count ?? 0;
    expect(allTime).toBe(0);
  });

  it('returns the actual count when present', () => {
    const aggregate = { _sum: { count: 42 } };
    expect(aggregate._sum.count ?? 0).toBe(42);
  });
});

// ─── avgResultCount rounding ──────────────────────────────────────────────────
describe('avgResultCount rounding', () => {
  it('rounds to one decimal place', () => {
    const raw = 12.345;
    const rounded = Math.round(raw * 10) / 10;
    expect(rounded).toBe(12.3);
  });

  it('returns null when the aggregate value is null', () => {
    const avg = { _avg: { resultCount: null } };
    const result = avg._avg.resultCount ? Math.round(avg._avg.resultCount * 10) / 10 : null;
    expect(result).toBeNull();
  });
});
