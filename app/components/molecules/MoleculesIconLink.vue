<template>
  <nuxt-link :to class="m-icon-link | button button-ghost" :class="{
    'm-icon-link-inline': !iconInline,
  }">
    <AtomsIcon v-if="icon" class="m-icon-link-icon" :class="{
      'm-icon-link-icon-large': iconLarge
    }" :icon :title="iconTitle" />

    {{ content }}
  </nuxt-link>
</template>

<script setup>
defineProps({
  to: {
    type: String,
  },
  icon: {
    type: String
  },
  iconTitle: {
    type: String
  },
  content: {
    type: String
  },
  iconLarge: {
    type: Boolean
  },
  iconInline: {
    type: Boolean
  }
})
</script>

<style lang="scss">
.m-icon-link.button {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: var(--border-radius-ui);
  text-decoration: none;
  color: currentColor;
  padding: var(--size-16);
  gap: var(--size-12);
  text-align: left;

  &:hover {
    color: currentColor;
  }
}

.m-icon-link-inline {
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: var(--size-4);
}

.m-icon-link-icon {
  flex: 0 0 auto;
  display: block;
  width: var(--size-24);
  height: var(--size-24);
  color: var(--secondary-500);
}

.m-icon-link-icon-large {
  width: var(--size-40);
  height: var(--size-40);
}
</style>