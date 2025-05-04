<template>
  <div role="presentation" class="m-formfield | flow flow-xs">
    <AtomsLabel :for="labelId">{{ label }}</AtomsLabel>

    <slot v-bind="{ id: labelId }"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true
  }
})

// Create ID for label
const labelId = useId()
</script>

<style>
.m-formfield {
  display: block;
}
</style>