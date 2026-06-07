---
applyTo: "tests/**"
description: "Use when writing tests for Virify. Covers composable, utility, and integration test patterns using Vitest and Nuxt test utils."
---

# Testing Guide for Virify

## Framework & Environment

- **Vitest** with `@nuxt/test-utils` — configured in `vitest.config.ts`
- Environment: `nuxt` with `jsdom` DOM environment
- Setup file: `tests/setup/nuxt.ts`
- Run tests: `pnpm test`

## File Locations

```
tests/
  unit/
    composables/   ← composable unit tests
    utils/         ← pure utility function tests
  integration/     ← integration tests (e.g. AI search, API flows)
```

Mirror the source path:
- `app/composables/useFoo.ts` → `tests/unit/composables/useFoo.test.ts`
- `app/utils/bar.ts` → `tests/unit/utils/bar.test.ts`
- `layers/dashboard/app/composables/useBaz.ts` → `tests/unit/composables/useBaz.test.ts`

## Unit Test Patterns

### Composable with imports (always lazy-import)

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('useMyComposable', () => {
  describe('Basic Structure', () => {
    it('should export a useMyComposable function', async () => {
      const { useMyComposable } = await import('../../../app/composables/useMyComposable')
      expect(typeof useMyComposable).toBe('function')
    })
  })

  describe('Logic', () => {
    it('should filter items correctly', () => {
      // Test pure logic with mock data — no need to call the composable itself
      const items = [{ id: 1, type: 'sale' }, { id: 2, type: 'rental' }]
      const saleItems = items.filter(i => i.type === 'sale')
      expect(saleItems).toHaveLength(1)
    })
  })
})
```

### Utility function tests (pure functions)

```ts
import { describe, it, expect } from 'vitest'
import { myUtil, anotherUtil } from '../../../app/utils/myUtil'

describe('myUtil', () => {
  it('should return expected value', () => {
    expect(myUtil('input')).toBe('expected')
  })

  it('should handle edge cases', () => {
    expect(myUtil('')).toBe('')
    expect(myUtil(null as any)).toBe(null)
  })
})
```

### Mocking Nuxt composables

Use `vi.hoisted()` and `vi.mock()` before the import:

```ts
import { describe, it, expect, vi } from 'vitest'

const mockUseToast = vi.hoisted(() => ({
  add: vi.fn()
}))

vi.mock('#imports', () => ({
  useToast: () => mockUseToast,
  ref: (val: any) => ({ value: val }),
  computed: (fn: any) => ({ value: fn() }),
}))
```

## Test Structure Conventions

Each test file should include:

1. **Basic Structure** describe block — verify the export exists and has correct type
2. **Core Logic** describe block(s) — test filtering, computation, transformations with mock data
3. **Edge Cases** — handle null, undefined, empty arrays, boundary values
4. **State Management** (if applicable) — test reactive state with `ref()`/`computed()`

## What to Test

✅ **Good candidates for unit tests:**
- Pure utility functions (no side effects) — 100% coverage target
- Computed filters (sale vs rental, active vs inactive)
- Default value structures
- State transformations (loading, error, success states)
- Input validation logic (pattern matching, required fields)

❌ **Avoid in unit tests:**
- Browser APIs (fetch, navigator, window) — mock these
- Nuxt-specific APIs (`useAsyncData`, `navigateTo`) — mock these  
- Direct DB/API calls — use integration tests for those

## Real Examples

### Testing filtering logic

```ts
it('should filter sale listings', () => {
  const mockListings = [
    { id: 1, saleListing: { price: 500000 } },
    { id: 2, rentalListing: { price: 1500 } },
  ]
  const saleOnly = mockListings.filter(l => l.saleListing)
  expect(saleOnly).toHaveLength(1)
  expect(saleOnly[0]!.id).toBe(1)
})
```

### Testing default values

```ts
it('should have correct default address structure', () => {
  const defaultAddress = {
    number: null, flat: null, name: null,
    street: '', city: '', locality: null,
    county: null, district: null, country: null,
    postcode: '', fullAddress: null, lat: null, lon: null,
  }
  expect(defaultAddress.street).toBe('')
  expect(defaultAddress.number).toBeNull()
})
```

### Testing Set-based pending state

```ts
it('should track pending items', () => {
  const pendingIds = new Set<number>()
  pendingIds.add(1)
  expect(pendingIds.has(1)).toBe(true)
  pendingIds.delete(1)
  expect(pendingIds.has(1)).toBe(false)
})
```
