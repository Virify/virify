<template>
  <ul class="m-autocomplete-pills">
    <li v-for="{ name } of options" key="option">
      <AtomsButtonPill :content="name" variant="ghost" :icon="icon" :icon-end="pillVariant === 'pin'" />
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  options: { name: string, location: string }[]
  icon?: string
  pillVariant?: 'trending' | 'pin'
}

withDefaults(defineProps<Props>(), {
  icon: 'search/pin',
  pillVariant: 'trending'
})
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