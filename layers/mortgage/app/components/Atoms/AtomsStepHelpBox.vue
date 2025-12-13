<template>
  <div class="a-step-help-box">
    <p v-if="title" class="| body-xs text-medium">{{ title }}</p>
    <p class="| body-xs">
      <slot />
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.a-step-help-box {
  margin-top: var(--size-16);
  padding: var(--size-12);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  text-align: left;

  p:first-child {
    margin-bottom: var(--size-4);
  }
}
</style>
