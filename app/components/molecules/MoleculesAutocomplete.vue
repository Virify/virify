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

  // Create pattern for regex
  const pattern = new RegExp(`^${input}`, 'i')

  // Get first match
  return matches.map((match: string) => ({
    current: input,
    suggestion: match.replace(pattern, ''),
    original: match
  }))
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