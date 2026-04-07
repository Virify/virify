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
  await import('../server/api/admin/users/index.get');
});

beforeEach(() => {
  vi.clearAllMocks();
  mockCreateError.mockImplementation((opts: { statusCode: number; statusMessage: string }) =>
    Object.assign(new Error(opts.statusMessage), opts),
  );
});

// ─── Auth guard ──────────────────────────────────────────────────────────────
describe('GET /api/admin/users — auth guard', () => {
  it('throws 403 when the user is not an admin', async () => {
    mockRequireUserSession.mockResolvedValue({ user: { id: 1, role: 'USER' } });
    mockIsAdmin.mockReturnValue(false);
    await expect(capturedHandler!({})).rejects.toMatchObject({ statusCode: 403 });
  });
});

// ─── Monthly growth bucketing ─────────────────────────────────────────────────
// Mirrors the growth bucketing logic from the endpoint exactly.
function buildGrowth(raw: { createdAt: Date }[]) {
  const growthMap: Record<string, number> = {};
  for (const u of raw) {
    const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, '0')}`;
    growthMap[key] = (growthMap[key] ?? 0) + 1;
  }
  return Object.entries(growthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));
}

describe('monthly growth bucketing', () => {
  it('assigns users to the correct year-month bucket', () => {
    const raw = [
      { createdAt: new Date('2025-04-10') },
      { createdAt: new Date('2025-06-22') },
    ];
    expect(buildGrowth(raw)).toEqual([
      { month: '2025-04', count: 1 },
      { month: '2025-06', count: 1 },
    ]);
  });

  it('sums multiple users registered in the same month', () => {
    const raw = [
      { createdAt: new Date('2025-03-01') },
      { createdAt: new Date('2025-03-15') },
      { createdAt: new Date('2025-03-29') },
    ];
    expect(buildGrowth(raw)).toEqual([{ month: '2025-03', count: 3 }]);
  });

  it('sorts months chronologically', () => {
    const raw = [
      { createdAt: new Date('2025-12-01') },
      { createdAt: new Date('2025-01-01') },
      { createdAt: new Date('2025-06-01') },
    ];
    const months = buildGrowth(raw).map((r) => r.month);
    expect(months).toEqual(['2025-01', '2025-06', '2025-12']);
  });

  it('zero-pads single-digit months', () => {
    const raw = [{ createdAt: new Date('2025-09-01') }];
    expect(buildGrowth(raw)[0].month).toBe('2025-09');
  });

  it('returns an empty array for no users', () => {
    expect(buildGrowth([])).toEqual([]);
  });
});

// ─── verificationCompleteness percentages ────────────────────────────────────
// Mirrors the verification completeness logic from the endpoint.
type Verification = { identity: boolean | null; address: boolean | null; bank: boolean | null; payslip: boolean | null };

function calcVerificationCompleteness(verifications: Verification[]) {
  const total = verifications.length || 1;
  const result = {
    identity: { count: verifications.filter((v) => v.identity === true).length, pct: 0 },
    address: { count: verifications.filter((v) => v.address === true).length, pct: 0 },
    bank: { count: verifications.filter((v) => v.bank === true).length, pct: 0 },
    payslip: { count: verifications.filter((v) => v.payslip === true).length, pct: 0 },
  };
  for (const k of Object.keys(result) as (keyof typeof result)[]) {
    result[k].pct = Math.round((result[k].count / total) * 100);
  }
  return result;
}

describe('verificationCompleteness percentages', () => {
  it('calculates what percentage of users have each field verified', () => {
    const verifications: Verification[] = [
      { identity: true, address: true, bank: false, payslip: false },
      { identity: true, address: false, bank: false, payslip: false },
      { identity: false, address: false, bank: false, payslip: false },
      { identity: false, address: false, bank: false, payslip: false },
    ];
    const result = calcVerificationCompleteness(verifications);
    expect(result.identity.count).toBe(2);
    expect(result.identity.pct).toBe(50);
    expect(result.address.pct).toBe(25);
    expect(result.bank.pct).toBe(0);
  });

  it('avoids division by zero when verifications list is empty', () => {
    const result = calcVerificationCompleteness([]);
    expect(result.identity.pct).toBe(0);
    expect(result.address.pct).toBe(0);
  });

  it('returns 100% when all users have a field verified', () => {
    const verifications: Verification[] = [
      { identity: true, address: true, bank: true, payslip: true },
      { identity: true, address: true, bank: true, payslip: true },
    ];
    const result = calcVerificationCompleteness(verifications);
    expect(result.identity.pct).toBe(100);
    expect(result.payslip.pct).toBe(100);
  });
});

// ─── Intent breakdown ─────────────────────────────────────────────────────────
// Mirrors the intent aggregation logic from the endpoint.
function buildIntentBreakdown(users: { intents: string[] }[]) {
  const intentMap: Record<string, number> = {};
  for (const u of users) {
    for (const intent of u.intents) {
      intentMap[intent] = (intentMap[intent] ?? 0) + 1;
    }
  }
  return Object.entries(intentMap).map(([intent, count]) => ({ intent, count }));
}

describe('intent breakdown', () => {
  it('aggregates intent counts across all users', () => {
    const users = [
      { intents: ['BUY', 'RENT'] },
      { intents: ['BUY'] },
      { intents: ['SELL'] },
    ];
    const result = buildIntentBreakdown(users);
    const buy = result.find((r) => r.intent === 'BUY');
    const rent = result.find((r) => r.intent === 'RENT');
    const sell = result.find((r) => r.intent === 'SELL');
    expect(buy?.count).toBe(2);
    expect(rent?.count).toBe(1);
    expect(sell?.count).toBe(1);
  });

  it('handles users with no intents', () => {
    const users = [{ intents: [] }, { intents: ['BUY'] }];
    const result = buildIntentBreakdown(users);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ intent: 'BUY', count: 1 });
  });

  it('returns an empty array when no users have intents', () => {
    expect(buildIntentBreakdown([{ intents: [] }])).toEqual([]);
  });
});
