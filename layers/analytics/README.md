# Analytics Layer

This layer provides analytics tracking functionality for the Virify application.

## Structure

- **Composables**: Client-side utilities for tracking events
  - `useAnalytics`: Tracks listing views and fetches analytics data

## Usage

### Track a listing view

```typescript
import { useAnalytics } from '#imports'

// In your component setup or method
const { trackListingView } = useAnalytics()

// When viewing a listing
onMounted(() => {
  if (route.params.id) {
    trackListingView(route.params.id)
  }
})
```

### Get user analytics

```typescript
import { useAnalytics } from '#imports'

// In your component setup
const { getUserAnalytics } = useAnalytics()
const analytics = ref(null)

// Fetch analytics data
async function fetchAnalytics() {
  analytics.value = await getUserAnalytics()
}

onMounted(fetchAnalytics)
```
