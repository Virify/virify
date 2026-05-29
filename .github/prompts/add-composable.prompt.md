---
mode: "agent"
description: "Add a new Vue composable to Virify following project conventions. Handles singleton vs local pattern selection, TypeScript typing, and test creation."
---

Create a new composable named `${input:composableName:Name of the composable, e.g. useMyFeature}` in Virify.

Purpose: `${input:purpose:What should this composable do?}`

## Steps

1. **Determine the correct location**:
   - Global app state → `app/composables/`
   - Dashboard-specific → `layers/dashboard/app/composables/`

2. **Determine singleton vs local**:
   - Shared state / API calls → use `createSharedComposable` from `@vueuse/core`
   - Local component state → regular `export function`

3. **Create the composable file** following this pattern:

```ts
import { createSharedComposable } from '@vueuse/core'

export const useMyFeature = createSharedComposable(() => {
  const toast = useToast()
  
  // State
  const items = ref<MyType[]>([])
  const isLoading = ref(false)

  // Computed
  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  async function fetchItems() {
    isLoading.value = true
    try {
      const data = await useRequestFetch()<MyType[]>('/api/my-endpoint')
      items.value = data ?? []
    } catch {
      toast.add({ title: 'Error', color: 'error', icon: 'i-lucide-circle-x' })
    } finally {
      isLoading.value = false
    }
  }

  return { items, isLoading, isEmpty, fetchItems }
})
```

4. **Write tests** in `tests/unit/composables/useMyFeature.test.ts` — test the exported function exists and all pure logic.

## Rules
- Always use `useRequestFetch()` for API calls, never `$fetch` or `fetch`
- Import types from `layers/database/server/database/prisma/generated/client` — never use `any`
- Do NOT manually import Nuxt auto-imports (`ref`, `computed`, `useToast`, etc.)
- If holding a list, include both the list and a derived count/computed
