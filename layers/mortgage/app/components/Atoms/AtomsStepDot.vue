<template>
  <span :class="dotClasses" />
</template>

<script setup lang="ts">
interface Props {
  active?: boolean
  completed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  completed: false,
})

const dotClasses = computed(() => [
  'a-step-dot',
  {
    'a-step-dot--active': props.active,
    'a-step-dot--completed': props.completed,
  },
])
</script>

<style lang="scss" scoped>
.a-step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: background 0.2s ease;

  &--active {
    background: var(--monochrome-900);
  }

  &--completed {
    background: var(--primary-400);
  }
}
</style>
