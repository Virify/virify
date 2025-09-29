<template>
  <header class="o-site-navigation__drawer-header">
    <NuxtLink to="/" class="o-site-navigation__brand" aria-label="Virify Home" @click="$emit('close')">
      <AtomsIcon icon="logo/horizontal-colour" width="120" height="36" />
    </NuxtLink>
    <button class="button button-quiet button-sm" aria-label="Close menu" @click="$emit('close')">✕</button>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  close: []
}>()
</script>

<style lang="scss" scoped>
.o-site-navigation__drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--size-16);
  border-bottom: 1px solid var(--border-300);
}

.o-site-navigation__brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}
</style>