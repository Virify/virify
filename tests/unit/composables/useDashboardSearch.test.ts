import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useState
const mockState = new Map<string, any>();

vi.mock('#imports', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useState: (key: string, init: any) => {
      if (!mockState.has(key)) {
        const initialValue = typeof init === 'function' ? init() : init;
        const state = {
          _value: initialValue,
          get value() { return this._value; },
          set value(v) { this._value = v; }
        };
        mockState.set(key, state);
      }
      return mockState.get(key);
    }
  };
});

describe('useDashboardSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.clear();
  });

  describe('State Management', () => {
    it('should initialize with empty groups', () => {
      const { groups } = useDashboardSearch();
      
      expect(groups.value).toEqual([]);
    });

    it('should set search groups', () => {
      const { groups, setGroups } = useDashboardSearch();
      
      const newGroups = [
        { id: 'group1', label: 'Group 1', items: [] },
        { id: 'group2', label: 'Group 2', items: [] }
      ];
      
      setGroups(newGroups);
      
      expect(groups.value).toEqual(newGroups);
    });

    it('should update groups reactively', () => {
      const { groups, setGroups } = useDashboardSearch();
      
      setGroups([{ id: 'test', label: 'Test', items: [] }]);
      expect(groups.value).toHaveLength(1);
      
      setGroups([
        { id: 'test1', label: 'Test 1', items: [] },
        { id: 'test2', label: 'Test 2', items: [] }
      ]);
      
      expect(groups.value).toHaveLength(2);
    });
  });

  describe('Shared State', () => {
    it('should share state across multiple instances', () => {
      const instance1 = useDashboardSearch();
      const instance2 = useDashboardSearch();
      
      instance1.setGroups([{ id: 'shared', label: 'Shared', items: [] }]);
      
      expect(instance2.groups.value).toEqual([{ id: 'shared', label: 'Shared', items: [] }]);
    });

    it('should preserve state when instance is recreated', () => {
      const instance1 = useDashboardSearch();
      instance1.setGroups([{ id: 'persist', label: 'Persist', items: [] }]);
      
      // Create new instance
      const instance2 = useDashboardSearch();
      
      expect(instance2.groups.value).toEqual([{ id: 'persist', label: 'Persist', items: [] }]);
    });
  });

  describe('Groups Structure', () => {
    it('should handle complex group structures', () => {
      const { setGroups, groups } = useDashboardSearch();
      
      const complexGroups = [
        {
          id: 'favourites-sales',
          label: 'Favourites Sale',
          items: [
            { id: 1, label: 'Property 1', to: '/listing/1' },
            { id: 2, label: 'Property 2', to: '/listing/2' }
          ]
        },
        {
          id: 'favourites-rentals',
          label: 'Favourites Rental',
          items: [
            { id: 3, label: 'Property 3', to: '/listing/3' }
          ]
        }
      ];
      
      setGroups(complexGroups);
      
      expect(groups.value).toEqual(complexGroups);
      expect(groups.value[0].items).toHaveLength(2);
      expect(groups.value[1].items).toHaveLength(1);
    });

    it('should allow empty items array', () => {
      const { setGroups, groups } = useDashboardSearch();
      
      setGroups([
        { id: 'empty', label: 'Empty Group', items: [] }
      ]);
      
      expect(groups.value[0].items).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle setting groups to empty array', () => {
      const { setGroups, groups } = useDashboardSearch();
      
      setGroups([{ id: 'test', label: 'Test', items: [] }]);
      expect(groups.value).toHaveLength(1);
      
      setGroups([]);
      expect(groups.value).toEqual([]);
    });

    it('should handle null-like values gracefully', () => {
      const { setGroups, groups } = useDashboardSearch();
      
      setGroups([
        { id: 'test', label: 'Test', items: [] }
      ]);
      
      // Setting to array should work
      expect(() => setGroups([])).not.toThrow();
      expect(groups.value).toEqual([]);
    });
  });
});
