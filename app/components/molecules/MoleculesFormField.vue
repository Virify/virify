<template>
  <div role="presentation" class="m-formfield | flow flow-xs">
    <AtomsLabel :for="labelId">{{ label }}</AtomsLabel>

    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  }
})

// Create ID for label
const labelId = useId()

// Provide label to children
provide('for', labelId)
</script>

<style>
.m-formfield {
  display: block;
}
</style>