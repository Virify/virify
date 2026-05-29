---
mode: "agent"
description: "Write unit tests for a Virify composable or utility file. Follows the project's Vitest patterns with lazy imports and mock data."
---

Write comprehensive unit tests for the file at `${input:filePath:Path to the composable or utility file, e.g. app/composables/useFoo.ts}`.

Follow these steps:
1. Read the target file to understand what it exports and its logic
2. Look at existing test files in `tests/unit/composables/` or `tests/unit/utils/` for pattern reference
3. Create the test file at the correct path mirroring the source

## Test requirements

The test file MUST include:

### 1. Basic Structure test
Verify the export exists with the correct type:
```ts
it('should export a useFoo function', async () => {
  const { useFoo } = await import('../../path/to/useFoo')
  expect(typeof useFoo).toBe('function')
})
```

### 2. Logic tests for every exported pure function
Test each function's happy path AND edge cases (null, undefined, empty array, boundary values).

### 3. Filtering/computation tests
For composables with filtered lists (sale vs rental, active vs inactive), test each filter variant with mock data.

### 4. Default value tests
Verify the shape and values of any default state objects.

## Rules
- Use lazy `await import(...)` for composable imports (avoids Nuxt context errors)
- Use **mock data objects** for all inputs — never call real APIs
- If the composable uses `useUserSession`, `useToast`, `useRequestFetch`, or similar Nuxt composables, test the **pure logic** in isolation without calling the composable itself
- Never use `any` in test code if the types can be inferred
- Add `beforeEach(() => { vi.clearAllMocks() })` if using `vi.fn()`

## Output
Create the file at the path mirroring the source in `tests/unit/`.
