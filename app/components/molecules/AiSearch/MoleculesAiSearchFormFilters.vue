<template>
  <div role="presentation" class="| flow">
    <div role="fieldset">
      <legend class="| visually-hidden">The property</legend>

      <MoleculesPromptbox :id="textareaId" placeholder="Describe your ideal property here..." v-model="searchQuery"
        :disabled="!isValid" @submit="searchSubmit" />
    </div>

    <!--
      @TODO
      Suggestions should dynamically update to whatever has been search
      to show relevant prompts. For example, if someone searches for a
      house with a garden. Until then, after a search has been done, the
      suggestions are fairly irrelevant and can be hidden
    -->
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
}

const props = defineProps<Props>();

/**
 *  Events
 */
const emits = defineEmits(['submit-search', 'reset-search']);

function searchSubmit() {
  emits('submit-search', searchQuery.value);
};

function searchReset() {
  searchQuery.value = ''

  emits('reset-search');
};

/**
 *  Track prompts
 */
const { searchQuery } = useAi();

watch(() => props.initialQuery, (newQuery) => {
  if (!newQuery) return

  searchQuery.value = newQuery;
});

/**
 *  Errors
 */
const isValid = computed(() => !props.disabled && unref(searchQuery).length)

/**
 *  Example prompts
 */
const textareaId = useId();

const examplePrompts = [
  "4 bedroom house with a garden for sale",
  "Studio flat with a balcony to rent",
  "2+ bedroom property to buy",
  "3 bedroom detached cottage with a downstairs bathroom for sale",
  "A large parcel of land",
  "3 bedroom house with a garden and a garage"
];

const addPrompt = (prompt: string) => {
  searchQuery.value = prompt;

  document?.getElementById(textareaId)?.focus();
};

</script>

<style lang="scss">
.m-ai-search-form-filters {

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