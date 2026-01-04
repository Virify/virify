<template>
  <nuxt-link
    :to="to || '#'"
    :class="[
      'o-site-navigation__dropdown-link | button button-quiet button-xs',
      { 'is-active': variant === 'category' && isActive }
    ]"
    role="menuitem"
    v-bind="$attrs"
    @click="handleClick"
  >
    <div class="o-site-navigation__dropdown-link-content">
      <AtomsIcon
        v-if="icon"
        :icon="icon"
        width="14"
        height="14"
        class="o-site-navigation__category-icon"
      />
      <span class="o-site-navigation__dropdown-label">{{ label }}</span>
    </div>
    <AtomsIcon
      v-if="showArrow"
      icon="chevron-right"
      width="14"
      height="14"
      class="o-site-navigation__arrow"
    />
  </nuxt-link>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })


type MegaMenuVariant = 'category' | 'single'

const emit = defineEmits<{
  click: []
}>()

withDefaults(defineProps<{
  to?: string
  label: string
  icon?: string
  variant?: MegaMenuVariant
  isActive?: boolean
  showArrow?: boolean
}>(), {
  to: '#',
  variant: 'category',
  isActive: false,
  showArrow: false,
})

function handleClick() {
  emit('click')
}

</script>

<style lang="scss" scoped>
.o-site-navigation {
  &__dropdown-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    text-align: left;
    padding: var(--size-8);
    color: inherit;
    text-decoration: none;
    background-color: transparent;
    cursor: pointer;
    border-radius: var(--border-radius-md);
    transition: background-color 0.15s ease-in-out;

    &:hover,
    &:focus,
    &.is-active {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &:not(:last-child) {
      margin-bottom: var(--size-4);
    }
  }

  &__dropdown-link-content {
    display: flex;
    align-items: center;
    gap: var(--size-6);
    width: 100%;
  }

  &__dropdown-label {
    display: inline-flex;
    align-items: center;
  }

  &__category-icon {
    flex-shrink: 0;
  }

  &__arrow {
    flex-shrink: 0;
  }
}
</style>
