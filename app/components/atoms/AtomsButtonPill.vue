<template>
  <button :class="buttonClasses" :data-highlight="shouldHighlight" class="body-xs">
    <span v-html="contentFormatted"></span>
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

const props = withDefaults(defineProps<Props>(), {
  iconEnd: true
})

// More maintainable highlight terms
const HIGHLIGHT_TERMS = [
  'to buy', 'to rent', 'for sale', 'to let', 'for rent',
] as const

const shouldHighlight = computed(() =>
  HIGHLIGHT_TERMS.some(term =>
    props.content.toLowerCase().includes(term.toLowerCase())
  )
)

const buttonClasses = computed(() => ({
  'a-pill-button': true,
  'a-pill-button--ghost': props.variant === 'ghost',
  'a-pill-button--filled': props.variant === 'solid',
  'a-pill-button--reversed': !!props.iconEnd
}))

const contentFormatted = computed(() => {
  if (!shouldHighlight.value) return props.content

  const regex = new RegExp(
    `(${HIGHLIGHT_TERMS.map(term =>
      term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    ).join('|')})`,
    'gi'
  )

  return props.content.replace(regex, '<mark>$1</mark>')
})
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.a-pill-button {
  display: flex;
  align-items: center;
  gap: var(--size-6);
  padding: var(--size-6) var(--size-14);
  border: 1px solid fn.faded-color(15%);
  background: var(--background-300);
  color: var(--color-200);
  border-radius: var(--border-radius-2xl);
  text-align: left;
  transition: background-color var(--animation-fast);
  line-height: var(--lineheight-sm);
  cursor: pointer;

  &:hover {
    background: var(--background-100);
  }

  svg {
    align-self: flex-start;
    flex-shrink: 0;
    width: var(--size-18);
    height: var(--lineheight-sm);
    color: var(--primary-400);
  }

  // Use semantic mark element instead of span
  mark {
    background: transparent;
    color: var(--primary-400);
    font-weight: 600;
  }

  // Variants
  &--filled {
    background: var(--primary-400);
    border-color: var(--primary-300);
    color: var(--monochrome-900);

    &:hover {
      background: var(--primary-300);
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

  &--reversed {
    flex-direction: row-reverse;
  }
}
</style>