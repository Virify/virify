<template>
  <div role="presentation" class="m-formfield" :class="{
    '|flow flow-xs': !noSpacing
  }">
    <AtomsLabel :for="labelId">{{ label }}</AtomsLabel>

    <slot v-bind="{ id: labelId }"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  noSpacing?: boolean
}

withDefaults(defineProps<Props>(), {
  noSpacing: false
})

// Create ID for label
const labelId = useId()
</script>

<style>
.m-formfield {
  display: block;
}
</style>