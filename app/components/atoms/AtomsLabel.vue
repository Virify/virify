<template>
  <label class="a-label">
    <span class="a-label-text | body-sm" v-if="label" role="presentation">{{ label }}</span>
    <slot></slot>
  </label>
</template>

<script setup>
defineProps({
  label: {
    type: String
  }
})
</script>

<style>
.a-label-text {
  display: block;
  margin-bottom: var(--size-6);
}
</style>