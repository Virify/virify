<template>
  <div class="no-results">
    <!-- Search context pills -->
    <MoleculesResultsContext :query-analysis="searchState?.queryAnalysis" :location :radius />

    <!-- Big header -->
    <h2 class="no-results__title | title-xl">No results found</h2>
    <p class="no-results__subtitle | body-md">We couldn't find any properties matching your search. Try one of these
      instead:</p>

    <!-- Suggestion prompts -->
    <ul class="no-results__suggestions">
      <li v-for="(prompt, index) of examplePrompts" :key="index">
        <AtomsButtonPill variant="ghost" :content="prompt" icon="ai/prompt" icon-start
          @click.prevent="searchWithPrompt(prompt)" />
      </li>
    </ul>

    <!-- CTA -->
    <NuxtLink to="/" class="no-results__cta | button button-md button-secondary">
      Start a new search
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  lastSearchQuery: string;
}>();

const { location, radius } = useGlobalSearchState()
const { searchState, setQuery } = useSearchState()

const { suggestedSearches: examplePrompts } = useAiSuggestedSearches();

function searchWithPrompt(prompt: string) {
  if (!location.value) {
    navigateTo('/')

    return
  }

  setQuery(prompt)
}
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--size-48) var(--size-16);
  min-height: 60vh;
  text-align: center;
  gap: var(--size-24);

  &__title {
    color: var(--heading-color);
    margin: 0;
  }

  &__subtitle {
    color: var(--text-muted);
    max-width: 400px;
    margin: 0;
  }

  &__suggestions {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0;
    margin: var(--size-16) 0 0;
    gap: var(--size-8);
    max-width: 700px;
  }

  &__cta {
    margin-top: var(--size-16);
  }
}
</style>
