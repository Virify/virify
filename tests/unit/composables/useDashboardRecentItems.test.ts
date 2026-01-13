import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDashboardRecentItems } from '../../../app/composables/useDashboardRecentItems';

// Shared state hoisted for mocks
const { sharedState, mocks } = vi.hoisted(() => ({
  sharedState: {
    loggedIn: false,
    recentFavourites: [] as any[],
    recentUserNotes: [] as any[],
    favouritesStatus: 'idle' as any,
    notesStatus: 'idle' as any
  },
  mocks: {
    requestFetch: vi.fn(),
    refreshFavourites: vi.fn(),
    refreshNotes: vi.fn()
  }
}));

// Mock Nuxt utils
vi.mock('#imports', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useUserSession: () => ({
      loggedIn: {
        get value() { return sharedState.loggedIn; },
        set value(v) { sharedState.loggedIn = v; }
      }
    }),
    useRequestFetch: () => mocks.requestFetch,
    useAsyncData: (key: string, fetcher: any, options: any) => {
      const isFavourites = key === 'recentFavourites';
      
      // Watch for loggedIn changes
      if (options.watch && options.immediate) {
        const loggedInRef = options.watch[0];
        if (loggedInRef && loggedInRef.value) {
          fetcher().then((result: any) => {
            if (isFavourites) {
              sharedState.recentFavourites = result;
              sharedState.favouritesStatus = 'success';
            } else {
              sharedState.recentUserNotes = result;
              sharedState.notesStatus = 'success';
            }
          });
        }
      }

      return {
        data: {
          get value() {
            return isFavourites ? sharedState.recentFavourites : sharedState.recentUserNotes;
          },
          set value(v) {
            if (isFavourites) {
              sharedState.recentFavourites = v;
            } else {
              sharedState.recentUserNotes = v;
            }
          }
        },
        refresh: isFavourites ? mocks.refreshFavourites : mocks.refreshNotes,
        status: {
          get value() {
            return isFavourites ? sharedState.favouritesStatus : sharedState.notesStatus;
          },
          set value(v) {
            if (isFavourites) {
              sharedState.favouritesStatus = v;
            } else {
              sharedState.notesStatus = v;
            }
          }
        }
      };
    }
  };
});

describe('useDashboardRecentItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sharedState.loggedIn = false;
    sharedState.recentFavourites = [];
    sharedState.recentUserNotes = [];
    sharedState.favouritesStatus = 'idle';
    sharedState.notesStatus = 'idle';
  });

  describe('Recent Favourites', () => {
    it('should not fetch favourites when not logged in', () => {
      sharedState.loggedIn = false;
      const { recentFavourites } = useDashboardRecentItems();
      
      expect(recentFavourites.value).toEqual([]);
    });

    it('should provide data access', () => {
      const { recentFavourites } = useDashboardRecentItems();
      
      // Should have reactive data reference
      expect(recentFavourites).toBeDefined();
      expect(recentFavourites.value).toBeDefined();
    });

    it('should provide refresh function', () => {
      const { refreshRecentFavourites } = useDashboardRecentItems();
      
      expect(refreshRecentFavourites).toBeInstanceOf(Function);
    });
  });

  describe('Recent Notes', () => {
    it('should not fetch notes when not logged in', () => {
      sharedState.loggedIn = false;
      const { recentUserNotes } = useDashboardRecentItems();
      
      expect(recentUserNotes.value).toEqual([]);
    });

    it('should provide data access', () => {
      const { recentUserNotes } = useDashboardRecentItems();
      
      // Should have reactive data reference
      expect(recentUserNotes).toBeDefined();
      expect(recentUserNotes.value).toBeDefined();
    });

    it('should provide refresh function', () => {
      const { refreshRecentNotes } = useDashboardRecentItems();
      
      expect(refreshRecentNotes).toBeInstanceOf(Function);
    });

    it('should track notes status', () => {
      const { recentNotesStatus } = useDashboardRecentItems();
      
      expect(recentNotesStatus.value).toBeDefined();
    });
  });

  describe('Shared Composable', () => {
    it('should be shared across multiple calls', () => {
      const instance1 = useDashboardRecentItems();
      const instance2 = useDashboardRecentItems();
      
      // Should be the same instance
      expect(instance1).toBe(instance2);
    });
  });
});
