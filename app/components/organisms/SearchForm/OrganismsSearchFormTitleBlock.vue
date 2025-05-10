<template>
  <div role="presentation" class="| flow flow-md">
    <h2 v-if="title" class="| title-xs">{{ title }}</h2>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script>