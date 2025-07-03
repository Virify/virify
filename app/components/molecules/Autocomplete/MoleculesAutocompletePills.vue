<template>
  <ul class="m-autocomplete-pills">
    <li v-for="option of options" :key="option.id">
      <slot v-bind="{ option }"></slot>
    </li>

    <li v-if="$slots.addendum">
      <slot name="addendum"></slot>
    </li>
  </ul>
</template>

<script setup lang="ts">

interface Props {
  options: UserSavedLocation[] | TrendingLocation[]
}

defineProps<Props>()
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