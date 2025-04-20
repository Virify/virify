<template>
  <span v-if="text" class="a-divider | divider">{{ text }}</span>
  <hr v-else class="| divider" />
</template>

<script setup>
defineProps({
  text: {
    type: String
  }
})
</script>

<style lang="scss">
.a-divider {
  display: flex;
  align-items: center;
  gap: var(--size-16);
  border: 0;

  &::before,
  &::after {
    content: '';
    display: block;
    flex-grow: 1;
    border-top: var(--divider-100);
  }
}
</style>