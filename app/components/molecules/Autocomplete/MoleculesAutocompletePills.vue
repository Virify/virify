<template>
  <ul class="m-autocomplete-pills">
    <li v-for="option of options" :key="option.name">
      <AtomsButtonPill :content="option.name" variant="ghost" :icon="icon" :icon-end="pillVariant === 'pin'" @click="$emit('selectedSavedLocation', option)" />
    </li>
  </ul>
</template>

<script setup lang="ts">

interface Props {
  options: UserSavedLocation[] | { name: string, location: string }[]
  icon?: string
  pillVariant?: 'trending' | 'pin'
}

withDefaults(defineProps<Props>(), {
  icon: 'search/pin',
  pillVariant: 'trending'
})

defineEmits<{
  (e: 'selectedSavedLocation', value: UserSavedLocation | { name: string; location: string }): void
}>();
</script>

<style lang="scss">
.m-autocomplete-pills {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: var(--size-8);
}
</style>