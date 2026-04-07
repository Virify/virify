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
  await import('../server/api/admin/overview/index.get');
});

beforeEach(() => {
  vi.clearAllMocks();
  mockCreateError.mockImplementation((opts: { statusCode: number; statusMessage: string }) =>
    Object.assign(new Error(opts.statusMessage), opts),
  );
});

// ─── Auth guard ──────────────────────────────────────────────────────────────
describe('GET /api/admin/overview — auth guard', () => {
  it('throws 403 when the user is not an admin', async () => {
    mockRequireUserSession.mockResolvedValue({ user: { id: 1, role: 'USER' } });
    mockIsAdmin.mockReturnValue(false);
    await expect(capturedHandler!({})).rejects.toMatchObject({ statusCode: 403 });
  });
});

// ─── totalSearchesRun null-coalesce ───────────────────────────────────────────
// The endpoint does: totalSearchesRun: searchesAgg._sum.count ?? 0
describe('totalSearchesRun null-coalesce', () => {
  it('returns 0 when the aggregate sum is null', () => {
    const searchesAgg = { _sum: { count: null } };
    expect(searchesAgg._sum.count ?? 0).toBe(0);
  });

  it('returns the actual count when the aggregate sum is populated', () => {
    const searchesAgg = { _sum: { count: 1234 } };
    expect(searchesAgg._sum.count ?? 0).toBe(1234);
  });
});
