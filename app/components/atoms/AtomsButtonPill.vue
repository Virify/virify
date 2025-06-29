<template>
  <button :class="{
    'a-pill-button': true,
    'a-pill-button--ghost': variant === 'ghost',
    'a-pill-button--filled': variant === 'solid',
    'a-pill-button--reversed': !!iconEnd
  }" class="| body-sm"
    @click="$emit('delete')">
    {{ content }}

    <AtomsIcon v-if="icon" :icon aria-hidden />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'ghost' | 'solid'
  content: 'cross' | 'ai/edit' | 'ai/prompt' | string
  icon?: string
  iconEnd?: boolean
}

withDefaults(defineProps<Props>(), {
  iconEnd: true
})

const emit = defineEmits<{
  (e: 'delete'): void
}>()

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.a-pill-button {
  display: flex;
  align-items: center;
  gap: var(--size-6);
  padding: var(--size-4) var(--size-14);
  border: 1px solid fn.faded-color(15%);
  background: var(--background-300);
  color: var(--color-200);
  border-radius: var(--border-radius-2xl);
  text-align: left;
  transition: background-color var(--animation-fast);
  cursor: pointer;

  &:hover {
    background: var(--background-200);
  }

  svg {
    flex-shrink: 0;
    width: var(--size-18);
    height: var(--size-18);
    color: var(--secondary-400);
  }

  /**
   *  Colour variants
   */
  &--filled {
    background: var(--secondary-400);
    border-color: var(--secondary-300);
    color: var(--monochrome-900);

    &:hover {
      background: var(--secondary-300);
    }

    svg {
      color: currentColor;
    }
  }

  &--ghost {
    background: transparent;

    &:hover {
      background: var(--background-300);
    }
  }

  /**
   *  Ordering
   */
  &--reversed {
    flex-direction: row-reverse;
  }
}
</style>