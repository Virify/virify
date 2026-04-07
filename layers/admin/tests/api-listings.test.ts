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
  await import('../server/api/admin/listings/index.get');
});

beforeEach(() => {
  vi.clearAllMocks();
  mockCreateError.mockImplementation((opts: { statusCode: number; statusMessage: string }) =>
    Object.assign(new Error(opts.statusMessage), opts),
  );
});

// ─── Auth guard ──────────────────────────────────────────────────────────────
describe('GET /api/admin/listings — auth guard', () => {
  it('throws 403 when the user is not an admin', async () => {
    mockRequireUserSession.mockResolvedValue({ user: { id: 1, role: 'USER' } });
    mockIsAdmin.mockReturnValue(false);
    await expect(capturedHandler!({})).rejects.toMatchObject({ statusCode: 403 });
  });
});

// ─── Draft funnel classification ─────────────────────────────────────────────
// Mirrors the draft funnel logic from the endpoint exactly.
type Draft = { completedSteps: number[] };

function classifyDrafts(allDrafts: Draft[]) {
  const abandonedDrafts = allDrafts.filter((d) => d.completedSteps.length === 0).length;
  const inProgressDrafts = allDrafts.filter(
    (d) => d.completedSteps.length > 0 && d.completedSteps.length < 10,
  ).length;
  const completedDrafts = allDrafts.filter((d) => d.completedSteps.length >= 10).length;
  return { abandonedDrafts, inProgressDrafts, completedDrafts };
}

describe('draft funnel classification', () => {
  it('classifies a draft with 0 steps as abandoned', () => {
    const { abandonedDrafts } = classifyDrafts([{ completedSteps: [] }]);
    expect(abandonedDrafts).toBe(1);
  });

  it('classifies a draft with 1–9 steps as in-progress', () => {
    const { inProgressDrafts } = classifyDrafts([
      { completedSteps: [1] },
      { completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
    ]);
    expect(inProgressDrafts).toBe(2);
  });

  it('classifies a draft with exactly 10 steps as completed', () => {
    const steps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const { completedDrafts } = classifyDrafts([{ completedSteps: steps }]);
    expect(completedDrafts).toBe(1);
  });

  it('classifies a draft with more than 10 steps as completed', () => {
    const { completedDrafts } = classifyDrafts([{ completedSteps: Array.from({ length: 12 }, (_, i) => i) }]);
    expect(completedDrafts).toBe(1);
  });

  it('correctly splits a mixed set of drafts', () => {
    const drafts = [
      { completedSteps: [] },
      { completedSteps: [1, 2, 3] },
      { completedSteps: Array.from({ length: 10 }, (_, i) => i) },
    ];
    expect(classifyDrafts(drafts)).toEqual({ abandonedDrafts: 1, inProgressDrafts: 1, completedDrafts: 1 });
  });

  it('returns zeros for an empty draft list', () => {
    expect(classifyDrafts([])).toEqual({ abandonedDrafts: 0, inProgressDrafts: 0, completedDrafts: 0 });
  });
});

// ─── avgStepsCompleted ────────────────────────────────────────────────────────
function calcAvgStepsCompleted(allDrafts: Draft[]) {
  return allDrafts.length > 0
    ? allDrafts.reduce((sum, d) => sum + d.completedSteps.length, 0) / allDrafts.length
    : 0;
}

describe('avgStepsCompleted', () => {
  it('calculates the average number of completed steps', () => {
    const drafts = [{ completedSteps: [1, 2] }, { completedSteps: [1, 2, 3, 4, 5, 6] }];
    expect(calcAvgStepsCompleted(drafts)).toBe(4);
  });

  it('returns 0 when there are no drafts', () => {
    expect(calcAvgStepsCompleted([])).toBe(0);
  });

  it('returns the step count when there is a single draft', () => {
    expect(calcAvgStepsCompleted([{ completedSteps: [1, 2, 3] }])).toBe(3);
  });
});
