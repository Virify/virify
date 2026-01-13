import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock cookies
const mockCookies = new Map<string, any>();

vi.mock('#imports', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useCookie: (key: string, options: any) => {
      if (!mockCookies.has(key)) {
        mockCookies.set(key, ref(options.default()));
      }
      return mockCookies.get(key);
    }
  };
});

describe('useDashboardListFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies.clear();
  });

  describe('Basic Filtering', () => {
    it('should initialize with default values', () => {
      const items = ref([]);
      const filter = useDashboardListFilter(items);
      
      expect(filter.searchQuery.value).toBe('');
      expect(filter.sortOrderValue.value).toBe('newest');
      expect(filter.saleRentFilter.value).toBe('all');
      expect(filter.activeTab.value).toBe('all');
      expect(filter.activeView.value).toBe('grid');
    });

    it('should return all items when no search query', () => {
      const mockItems = [
        { id: 1, listing: { property: { address: { city: 'London' } } } },
        { id: 2, listing: { property: { address: { city: 'Manchester' } } } }
      ];
      
      const items = ref(mockItems);
      const filter = useDashboardListFilter(items);
      
      expect(filter.filteredItems.value).toEqual(mockItems);
    });

    it('should filter by address search', async () => {
      const mockItems = [
        { id: 1, listing: { property: { address: { city: 'London', street: 'Main St' } } } },
        { id: 2, listing: { property: { address: { city: 'Manchester', street: 'Oak Ave' } } } }
      ];
      
      const items = ref(mockItems);
      const filter = useDashboardListFilter(items);
      
      filter.searchQuery.value = 'London';
      
      // Wait for debounce
      await vi.waitFor(() => {
        expect(filter.filteredItems.value).toHaveLength(1);
        expect(filter.filteredItems.value[0].id).toBe(1);
      }, { timeout: 500 });
    });

    it('should filter by price', async () => {
      const mockItems = [
        { id: 1, listing: { saleListing: { price: 500000 }, property: { address: {} } } },
        { id: 2, listing: { saleListing: { price: 250000 }, property: { address: {} } } }
      ];
      
      const items = ref(mockItems);
      const filter = useDashboardListFilter(items);
      
      filter.searchQuery.value = '500000';
      
      await vi.waitFor(() => {
        expect(filter.filteredItems.value).toHaveLength(1);
        expect(filter.filteredItems.value[0].id).toBe(1);
      }, { timeout: 500 });
    });

    it('should filter by note content', async () => {
      const mockItems = [
        { 
          id: 1, 
          note: 'Great location',
          listing: { property: { address: { city: 'London' } } } 
        },
        { 
          id: 2, 
          note: 'Needs renovation',
          listing: { property: { address: { city: 'Manchester' } } } 
        }
      ];
      
      const items = ref(mockItems);
      const filter = useDashboardListFilter(items);
      
      filter.searchQuery.value = 'location';
      
      await vi.waitFor(() => {
        expect(filter.filteredItems.value).toHaveLength(1);
        expect(filter.filteredItems.value[0].id).toBe(1);
      }, { timeout: 500 });
    });
  });

  describe('Sort Options', () => {
    it('should provide default sort options', () => {
      const items = ref([]);
      const filter = useDashboardListFilter(items);
      
      expect(filter.sortOrder.value).toEqual([
        { label: 'Newest', value: 'newest', icon: 'i-lucide-calendar-arrow-up' },
        { label: 'Oldest', value: 'oldest', icon: 'i-lucide-calendar-arrow-down' }
      ]);
    });

    it('should include listing sort option for enquiries', () => {
      const items = ref([]);
      const filter = useDashboardListFilter(items, { enquiries: true });
      
      expect(filter.sortOrder.value).toHaveLength(3);
      expect(filter.sortOrder.value[2]).toEqual({
        label: 'Listing',
        value: 'listing',
        icon: 'i-lucide-list-tree'
      });
    });

    it('should hide listing sort option when hideListingSort is true', () => {
      const items = ref([]);
      const filter = useDashboardListFilter(items, { 
        enquiries: true,
        hideListingSort: true 
      });
      
      expect(filter.sortOrder.value).toHaveLength(2);
      expect(filter.sortOrder.value.find(o => o.value === 'listing')).toBeUndefined();
    });
  });

  describe('Filter Options', () => {
    it('should provide sale/rent filter options', () => {
      const items = ref([]);
      const filter = useDashboardListFilter(items);
      
      expect(filter.saleRentOptions).toEqual([
        { label: 'All', value: 'all', icon: 'i-lucide-home' },
        { label: 'Sale', value: 'sale', icon: 'i-lucide-tag' },
        { label: 'Rent', value: 'rent', icon: 'i-lucide-key' }
      ]);
    });

    it('should provide direction filter options', () => {
      const items = ref([]);
      const filter = useDashboardListFilter(items);
      
      expect(filter.directionOptions).toEqual([
        { label: 'All Enquiries', value: 'all', icon: 'i-lucide-inbox' },
        { label: 'Sent Enquiries', value: 'sent', icon: 'i-lucide-send' },
        { label: 'Received Enquiries', value: 'received', icon: 'i-lucide-mail' }
      ]);
    });

    it('should provide tab items', () => {
      const items = ref([]);
      const filter = useDashboardListFilter(items);
      
      expect(filter.tabItems).toEqual([
        { label: 'All', value: 'all', icon: 'i-lucide-inbox' },
        { label: 'Unread', value: 'unread', icon: 'i-lucide-mail' }
      ]);
    });

    it('should provide view options', () => {
      const items = ref([]);
      const filter = useDashboardListFilter(items);
      
      expect(filter.viewOptions).toEqual([
        { label: '', icon: 'i-lucide-layout-grid', value: 'grid' },
        { label: '', icon: 'i-lucide-list', value: 'list' }
      ]);
    });
  });

  describe('Cookie Persistence', () => {
    it('should create cookies when persistenceKey is provided', () => {
      const items = ref([]);
      const filter = useDashboardListFilter(items, { 
        persistenceKey: 'my-dashboard' 
      });
      
      // Just verify composable initializes without error
      expect(filter.sortOrderValue.value).toBeDefined();
      expect(filter.saleRentFilter.value).toBeDefined();
    });

    it('should use standard refs when persistenceKey is not provided', () => {
      const items = ref([]);
      const filter = useDashboardListFilter(items);
      
      filter.sortOrderValue.value = 'oldest';
      
      // Should work without cookies
      expect(filter.sortOrderValue.value).toBe('oldest');
    });
  });

  describe('Edge Cases', () => {
    it('should handle items without listings', async () => {
      const mockItems = [
        { id: 1 }, // No listing
        { id: 2, listing: { property: { address: { city: 'London' } } } }
      ];
      
      const items = ref(mockItems);
      const filter = useDashboardListFilter(items);
      
      filter.searchQuery.value = 'London';
      
      await vi.waitFor(() => {
        expect(filter.filteredItems.value).toHaveLength(1);
        expect(filter.filteredItems.value[0].id).toBe(2);
      }, { timeout: 500 });
    });

    it('should handle nested note object', async () => {
      const mockItems = [
        { 
          id: 1,
          note: { note: 'Great property' },
          listing: { property: { address: {} } }
        }
      ];
      
      const items = ref(mockItems);
      const filter = useDashboardListFilter(items);
      
      filter.searchQuery.value = 'Great';
      
      await vi.waitFor(() => {
        expect(filter.filteredItems.value).toHaveLength(1);
      }, { timeout: 500 });
    });

    it('should use custom dateKey option', () => {
      const items = ref([]);
      const filter = useDashboardListFilter(items, { 
        dateKey: 'updatedAt' 
      });
      
      // Just verify it doesn't error
      expect(filter).toBeDefined();
    });

    it('should handle userId option', () => {
      const userId = ref('user-123');
      const items = ref([]);
      const filter = useDashboardListFilter(items, { 
        userId 
      });
      
      // Just verify it doesn't error
      expect(filter).toBeDefined();
    });
  });
});
