<template>
  <aside v-if="isVisible" :id="tipId" class="a-collapsible-tip | lineheight-md body-md font-medium">
    <button type="button" :aria-controls="tipId" aria-expanded="true" aria-label="Close this tip"
      class="a-collapsible-tip__close-button | button-none" @click.prevent="closeSelf">
      <AtomsIcon icon="cross" title="Cross" />
    </button>

    <AtomsIcon v-if="icon" class="a-collapsible-tip__icon" :icon="icon" aria-hidden />

    <div role="presentation" class="a-collapsible-tip__content">
      <slot></slot>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'content/info'
})

/**
 *  a11y
 */
const tipId = useId()

/**
 *  Close tip
 */
const isVisible = ref(true)

function closeSelf() {
  isVisible.value = false
}
</script>

<style lang="scss">
.a-collapsible-tip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-800);
  color: var(--primary-100);
  border-radius: var(--border-radius-xl);
  padding: var(--size-16);
  gap: var(--size-16);
  padding-right: var(--size-48);

  &__icon {
    width: var(--size-32);
    height: var(--size-32);
    color: var(--primary-400);
    flex-shrink: 0;
  }

  &__close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: var(--size-6);
    right: var(--size-6);
    width: var(--size-32);
    height: var(--size-32);
    color: var(--primary-100);
    transition: color var(--animation-fast);
    cursor: pointer;

    &:hover {
      color: var(--primary-400);
    }

    .a-icon {
      width: var(--size-24);
      height: var(--size-24);
    }
  }

  &__content {
    flex-grow: 1;
  }
}
</style>