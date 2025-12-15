<template>
  <button v-bind="$attrs" class="| button" :class="{
    'button-pending': pending,
    'button-primary': variant === 'primary',
    'button-secondary': variant === 'secondary',
    'button-tertiary': variant === 'tertiary',
  }" :disabled="pending">
    <AtomsIcon v-if="pending" title="Pending" icon="animated-dots/animated-dots" />
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script setup lang="ts">
interface Props {
  pending?: boolean
  variant?: 'primary' | 'secondary' | 'tertiary'
}

withDefaults(defineProps<Props>(), {
  pending: false,
  variant: 'primary',
})

useHead({
  link: [
    {
      rel: 'prefetch',
      as: 'image',
      href: '/sprites/icon-animated-dots.svg',
      type: 'image/svg+xml'
    },
  ]
})
</script>