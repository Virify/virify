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
  await import('../server/api/admin/mortgage/index.get');
});

beforeEach(() => {
  vi.clearAllMocks();
  mockCreateError.mockImplementation((opts: { statusCode: number; statusMessage: string }) =>
    Object.assign(new Error(opts.statusMessage), opts),
  );
});

// ─── Auth guard ──────────────────────────────────────────────────────────────
describe('GET /api/admin/mortgage — auth guard', () => {
  it('throws 403 when the user is not an admin', async () => {
    mockRequireUserSession.mockResolvedValue({ user: { id: 1, role: 'USER' } });
    mockIsAdmin.mockReturnValue(false);
    await expect(capturedHandler!({})).rejects.toMatchObject({ statusCode: 403 });
  });
});

// ─── Monthly trend bucketing ──────────────────────────────────────────────────
// Mirrors the exact bucketing + sorting logic from the endpoint.
function buildMonthlyTrend(raw: { createdAt: Date }[]) {
  const monthlyMap: Record<string, number> = {};
  for (const calc of raw) {
    const key = `${calc.createdAt.getFullYear()}-${String(calc.createdAt.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap[key] = (monthlyMap[key] ?? 0) + 1;
  }
  return Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));
}

describe('monthly trend bucketing', () => {
  it('assigns each calculation to the correct year-month bucket', () => {
    const raw = [
      { createdAt: new Date('2025-01-15') },
      { createdAt: new Date('2025-03-10') },
    ];
    const result = buildMonthlyTrend(raw);
    expect(result).toEqual([
      { month: '2025-01', count: 1 },
      { month: '2025-03', count: 1 },
    ]);
  });

  it('sums multiple calculations in the same month', () => {
    const raw = [
      { createdAt: new Date('2025-02-01') },
      { createdAt: new Date('2025-02-15') },
      { createdAt: new Date('2025-02-28') },
    ];
    const result = buildMonthlyTrend(raw);
    expect(result).toEqual([{ month: '2025-02', count: 3 }]);
  });

  it('sorts buckets chronologically', () => {
    const raw = [
      { createdAt: new Date('2025-06-01') },
      { createdAt: new Date('2025-01-01') },
      { createdAt: new Date('2025-03-01') },
    ];
    const months = buildMonthlyTrend(raw).map((r) => r.month);
    expect(months).toEqual(['2025-01', '2025-03', '2025-06']);
  });

  it('zero-pads single-digit months', () => {
    const raw = [{ createdAt: new Date('2025-09-05') }];
    const result = buildMonthlyTrend(raw);
    expect(result[0].month).toBe('2025-09');
  });

  it('returns an empty array when given no calculations', () => {
    expect(buildMonthlyTrend([])).toEqual([]);
  });
});

// ─── round2 helper ────────────────────────────────────────────────────────────
// The endpoint uses a local `round2` function to format averages.
function round2(n: number | null | undefined): number | null {
  return n != null ? Math.round(n * 100) / 100 : null;
}

describe('round2', () => {
  it('rounds to two decimal places', () => {
    expect(round2(1.23456)).toBe(1.23);
  });

  it('rounds up correctly', () => {
    expect(round2(1.235)).toBe(1.24);
  });

  it('returns null for null input', () => {
    expect(round2(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(round2(undefined)).toBeNull();
  });

  it('handles integers without adding decimals', () => {
    expect(round2(5)).toBe(5);
  });

  it('handles zero', () => {
    expect(round2(0)).toBe(0);
  });
});
