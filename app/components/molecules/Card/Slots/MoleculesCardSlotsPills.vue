<template>
  <ul class="m-card-lots-pills">
    <li v-for="pill of pills" :key="pill" class="m-card-lots-pills__pill | body-xs">
      {{ pill }}
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  pills: string[]
}

defineProps<Props>()

</script>

<style lang="scss">
.m-card-lots-pills {
  list-style: none;
  margin: var(--size-10) 0;
  padding: 0;
  display: flex;
  gap: var(--size-6);
  flex-wrap: wrap;

  &__pill {
    display: flex;
    align-items: center;
    padding: var(--size-4) var(--size-12);
    line-height: var(--lineheight-xs);
    border: 1px solid var(--card-border-colour);
    background-color: var(--card-background-pill);
    border-radius: var(--border-radius-pill);
    white-space: nowrap;
    font-weight: var(--font-semibold);
  }
}
</style>