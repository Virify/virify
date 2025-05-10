<template>
  <fieldset class="o-searchform-rooms | flow flow-xs">
    <legend class="o-searchform-rooms-title | title-xs">
      {{ legend }}
    </legend>

    <div class="o-searchform-rooms-grid">
      <slot v-bind="{ id: fieldsetId }"></slot>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
interface Props {
  legend: string
}

defineProps<Props>()

const fieldsetId = useId()
</script>

<style>
.o-searchform-rooms-grid {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: var(--size-14);
}
</style>