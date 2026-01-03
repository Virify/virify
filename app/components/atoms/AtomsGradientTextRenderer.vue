<template>
  <template v-for="(part, index) in parsedParts" :key="index">
    <span v-if="part.isGradient" :class="gradientClassToUse">{{ part.text }}</span>
    <span v-else>{{ part.text }}</span>
  </template>
</template>

<script setup lang="ts">
interface Props {
  text: string
  variant?: 'light' | 'dark' | 'auto'
  background?: 'white' | 'gradient'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'auto'
})

const parsedParts = computed(() => {
  return parseGradientTextParts(props.text)
})

const gradientClassToUse = computed(() => {
  if (props.variant === 'light') return 'gradient-text-light'
  if (props.variant === 'dark') return 'gradient-text'
  
  // Auto mode: determine based on background
  if (props.background === 'white' || props.background === undefined) {
    return 'gradient-text-light'
  }
  return 'gradient-text'
})
</script>
