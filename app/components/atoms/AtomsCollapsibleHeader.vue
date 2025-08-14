<template>
  <button 
    :class="[
      'collapsible-header',
      `collapsible-header--${variant}`
    ]"
    @click="$emit('toggle')" 
    :aria-expanded="!isCollapsed" 
    :aria-controls="ariaControls"
  >
    <h2 class="collapsible-header__title | body-md font-semibold">
      <AtomsIcon v-if="icon && (variant === 'card' || variant === 'inline')" :icon="icon" :size="20" class="title-icon" />
      <slot name="title">{{ title }}</slot>
      <ClientOnly>
        <slot name="actions"></slot>
      </ClientOnly>
    </h2>
    <AtomsIcon 
      icon="chevron-down" 
      :size="variant === 'card' ? 24 : 18" 
      class="collapsible-header__chevron" 
      :class="{ 'collapsible-header__chevron--open': !isCollapsed }" 
    />
  </button>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  icon?: string;
  isCollapsed: boolean;
  variant?: "card" | "plain" | "inline";
  ariaControls?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "card",
});

defineEmits<{
  toggle: [];
}>();
</script>

<style lang="scss">
.collapsible-header {
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  gap: var(--size-16);
  margin-bottom: var(--size-16);

  &:hover {
    .collapsible-header__chevron {
      color: var(--foreground-100);
    }
  }

  &__title {
    margin: 0;
    text-transform: capitalize;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: var(--size-8);
    flex: 1;
    min-width: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  // Card variant (styled with background, border, shadow)
  &--card {
    background: var(--background-100);
    border: 1px solid var(--monochrome-600);
    border-radius: var(--border-radius-lg);
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
    padding: var(--size-16);
  }

  // Plain variant (minimal style)
  &--plain {
    background: none;
    border: none;
    padding: 0;
    margin-bottom: var(--size-8);
  }

  // Inline variant (for use within other styled containers)
  &--inline {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  &__chevron {
    color: var(--foreground-200);
    transition: transform var(--animation-medium) var(--ease-in-out), color var(--animation-medium) var(--ease-in-out);

    &--open {
      transform: rotate(180deg);
    }
  }
}
</style>