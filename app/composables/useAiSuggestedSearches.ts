import { createSharedComposable } from "@vueuse/core";

const DEFAULT_SUGGESTED_SEARCHES = [
  "4 bedroom house with a garden for sale",
  "Studio flat with a balcony to rent",
  "2+ bedroom property to buy",
  "3 bedroom detached cottage with a downstairs bathroom for sale",
  "A large parcel of land",
  "3 bedroom house with a garden and a garage",
];

export const useAiSuggestedSearches = createSharedComposable(() => {
  const { data: recentSearches } = useAsyncData(
    'ai-suggested-searches',
    () => useRequestFetch()<string[]>('/api/analytics/search/recent'),
    { default: (): string[] => [], immediate: true },
  );

  const suggestedSearches = computed(() => {
    const recent = recentSearches.value ?? []
    const needed = Math.max(0, 6 - recent.length)
    const defaults = DEFAULT_SUGGESTED_SEARCHES.filter((d) => !recent.includes(d)).slice(0, needed)
    return [...recent, ...defaults].slice(0, 6)
  });

  return { suggestedSearches };
});
