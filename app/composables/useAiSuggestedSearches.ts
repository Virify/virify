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

  const suggestedSearches = computed(() =>
    recentSearches.value?.length ? recentSearches.value : DEFAULT_SUGGESTED_SEARCHES,
  );

  return { suggestedSearches };
});
