<template>
  <nuxt-link
    :to="to || '#'"
    class="o-site-navigation__sub-dropdown-link | body-xs"
    role="menuitem"
    v-bind="$attrs"
    @click="handleClick"
  >
    <AtomsIcon
      v-if="icon"
      :icon="icon"
      width="14"
      height="14"
      class="o-site-navigation__sub-dropdown-icon"
    />
    <span class="o-site-navigation__sub-dropdown-label">{{ label }}</span>
  </nuxt-link>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  click: []
}>()

const props = withDefaults(defineProps<{
  to?: string
  label: string
  icon?: string
}>(), {
  to: '#',
})

function handleClick() {
  emit('click')
}
</script>

<style lang="scss" scoped>
.o-site-navigation {
  &__sub-dropdown-link {
    display: flex;
    align-items: center;
    gap: var(--size-4);
    padding: var(--size-6) var(--size-10);
    color: inherit;
    text-decoration: none;
    border-radius: var(--border-radius-lg);
    transition: background-color 0.15s ease-in-out;

    &:hover,
    &:focus {
      background-color: rgba(255, 255, 255, 0.12);
    }

    &:not(:last-child) {
      margin-bottom: var(--size-2);
    }
  }

  &__sub-dropdown-icon {
    flex-shrink: 0;
  }

  &__sub-dropdown-label {
    display: inline-flex;
    align-items: center;
  }
}
</style>
