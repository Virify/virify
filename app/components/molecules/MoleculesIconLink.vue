<template>
  <nuxt-link :to class="m-icon-link | button button-ghost">
    <AtomsIcon v-if="icon" class="m-icon-link-icon" :icon :title="iconTitle" />

    {{ content }}
  </nuxt-link>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  iconTitle: {
    type: String
  },
  content: {
    type: String
  }
})
</script>

<style lang="scss">
.m-icon-link {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  border-radius: var(--border-radius-ui);
  text-decoration: none;
  aspect-ratio: 16/9;
  padding: var(--size-16);
  gap: var(--size-4);
}

.m-icon-link-icon {
  display: block;
  width: var(--size-40);
  height: var(--size-40);
  color: var(--secondary-500);
}
</style>