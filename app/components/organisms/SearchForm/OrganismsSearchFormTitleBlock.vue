<template>
  <div role="presentation" class="| flow flow-md">
    <h2 v-if="title" :class="{
      '| title-xs': !titleLarge,
      '| title-md': titleLarge,
    }">{{ title }}</h2>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  titleLarge?: boolean
}

withDefaults(defineProps<Props>(), {
  titleLarge: false
})
</script>