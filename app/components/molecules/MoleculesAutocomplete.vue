<template>
  <ul class="m-autocomplete">
    <li v-for="match of matchesComputed">
      <slot v-bind="{ ...match }"></slot>
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

  return matches.map((match: string) => {
    // For exact matches we still want to show them, but highlight properly
    const isExactMatch = match.toLowerCase() === input.toLowerCase()

    if (isExactMatch) {
      return {
        current: input,
        suggestion: match.substring(input.length),
        original: match
      }
    }

    // For partial matches, highlight the matching prefix
    if (match.toLowerCase().startsWith(input.toLowerCase())) {
      return {
        current: match.substring(0, input.length),
        suggestion: match.substring(input.length),
        original: match
      }
    }

    // For non-matching items, don't highlight anything
    return {
      current: '',
      suggestion: match,
      original: match
    }
  })
})
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-autocomplete {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>