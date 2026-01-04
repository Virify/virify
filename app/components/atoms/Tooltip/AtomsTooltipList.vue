<template>
  <div class="a-tooltip-list">
    <p v-if="title" class="body-xs a-tooltip-list__title">{{ title }}</p>
    <ul class="a-tooltip-list__items">
      <li 
        v-for="(item, index) in items" 
        :key="index"
        class="body-xs a-tooltip-list__item"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  items: string[];
}>();
</script>

<style lang="scss">
.a-tooltip-list {

  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  &__title {
    margin-bottom: var(--size-8);
    font-weight: 500;
  }

  &__items {
    margin: 0;
    padding-left: var(--size-16);
  }

  &__item {
    margin-bottom: var(--size-4);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>