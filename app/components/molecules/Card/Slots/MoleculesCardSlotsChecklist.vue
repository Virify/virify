<template>
  <ul class="m-card-slots-checklist">
    <li v-for="{ label } of list" class="m-card-slots-checklist__row | body-xs">
      <AtomsIcon icon="tick" />
      {{ label }}
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  list: { label: string, value: string | boolean }[]
}

defineProps<Props>()

</script>

<style lang="scss">
.m-card-slots-checklist {
  list-style: none;
  margin: 0 0 var(--size-16);
  padding: 0;
  display: grid;
  grid-gap: var(--size-6);
  column-gap: var(--size-12);
  grid-template-columns: auto auto;

  &__row {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: var(--size-8);
    line-height: var(--lineheight-md);
    white-space: nowrap;
  }

  .a-icon {
    color: var(--card-colour);
    width: var(--size-20);
    height: var(--lineheight-md);
    flex-shrink: 0;
  }

  @container listing-card-content (width < 300px) {
    grid-template-columns: 1fr;
  }
}
</style>