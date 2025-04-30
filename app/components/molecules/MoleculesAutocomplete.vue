<template>
  <ul class="m-autocomplete">
    <li v-for="{ current, suggestion, original } of matchesComputed">
      <button class="m-autocomplete-button | body-md" @click.prevent="emitSuggestion(original)">
        <strong class="m-autocomplete-highlight">{{ current }}</strong>{{ suggestion }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  input?: string
  matches?: string[]
}

const props = defineProps<Props>()

/**
 *  Style autocomplete
 */
const matchesComputed = computed(() => {
  const { matches, input } = props

  // If no matches, ignore
  if (!isString(input) || !isArrayOfStrings(matches) || !matches.length) {
    return []
  }

  // Create pattern for regex
  const pattern = new RegExp(`^${input}`, 'i')

  // Get first match
  return matches.map((match: string) => ({
    current: input,
    suggestion: match.replace(pattern, ''),
    original: match
  }))
})

/**
 *  Emits
 */
const emits = defineEmits(['suggestion-selected'])

function emitSuggestion(suggestion: string) {
  emits('suggestion-selected', suggestion)
}
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-autocomplete {
  list-style: none;
  margin: 0;
  padding: 0;
}

.m-autocomplete-button {
  display: block;
  width: 100%;
  padding: var(--size-8) var(--size-14);
  border-radius: var(--border-radius-ui);
  cursor: pointer;
  text-align: left;
  color: currentColor;
  background-color: transparent;
  transition: background-color var(--animation-fast);
}

.m-autocomplete-button:hover,
.m-autocomplete:not(:has(.m-autocomplete-button:hover)) li:first-child .m-autocomplete-button {
  background: fn.faded-color(8%);
  color: var(--foreground-100);
}
</style>