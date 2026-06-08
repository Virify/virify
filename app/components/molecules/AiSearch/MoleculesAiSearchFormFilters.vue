<template>
  <div role="presentation" class="| flow">
    <div role="fieldset">
      <legend class="| visually-hidden">The property</legend>

      <MoleculesPromptbox :id="textareaId" placeholder="Describe your ideal property here..." v-model="searchQuery"
        :disabled="!isValid" :loading="props.loading || isChecking" @submit="searchSubmit" />

      <p v-if="moderationError" class="m-ai-search-form-filters__error" role="alert">{{ moderationError }}</p>
    </div>

    <ul v-if="!hideSuggestions" class="m-ai-search-form-filters__example-prompts">
      <li v-for="(prompt, index) of examplePrompts" :key="index">
        <AtomsButtonPill variant="ghost" :content="prompt" icon="ai/prompt" icon-start
          @click.prevent="addPrompt(prompt)" />
      </li>
    </ul>

    <AtomsButton v-if="!hideReset" :disabled="!isValid" @click.prevent="searchReset" type="reset"
      class="| button button-xs button-delete button-full button-bordered">
      Reset filters
    </AtomsButton>
  </div>
</template>


<script setup lang="ts">
interface Props {
  initialQuery?: string;
  disabled?: boolean
  hideSuggestions?: boolean
  hideReset?: boolean
  loading?: boolean
}

const props = defineProps<Props>();

/**
 *  Events
 */
const emits = defineEmits(['submit-search']);

const { checkText, isChecking } = useModeration();
const moderationError = ref<string | null>(null)

async function searchSubmit() {
  moderationError.value = null
  const { safe, reason } = await checkText(searchQuery.value)
  if (!safe) {
    moderationError.value = reason || 'Please try a different search.'
    return
  }
  emits('submit-search', searchQuery.value);
};

/**
 *  Reset AI search query
 */
const { setQuery } = useGlobalSearchState()

function searchReset() {
  searchQuery.value = ''

  setQuery('')
};

/**
 *  Track prompts
 */
const { searchQuery } = useAi();

/**
 *  @TODO convert this to a v-model
 */
watch(() => props.initialQuery, (newQuery) => {
  if (!newQuery) return
  searchQuery.value = newQuery;
});

watch(searchQuery, () => {
  moderationError.value = null
});

/**
 *  Errors
 */
const isValid = computed(() => !props.disabled && unref(searchQuery).length)

/**
 *  Example prompts
 */
const textareaId = useId();

const { suggestedSearches: examplePrompts } = useAiSuggestedSearches();

const addPrompt = (prompt: string) => {
  searchQuery.value = prompt;

  document?.getElementById(textareaId)?.focus();
};

</script>

<style lang="scss">
.m-ai-search-form-filters {

  &__error {
    margin-top: var(--size-8);
    color: var(--color-error-500);
    font-size: var(--text-sm);
  }

  &__example-prompts {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: var(--size-32) 0 0;
    gap: var(--size-8);
    flex: 1;
  }
}
</style>