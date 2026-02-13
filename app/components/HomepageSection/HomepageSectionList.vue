<template>
  <ul class="homepage-section-list">
    <slot v-for="{ id, title, icon, content } of sections" :id :title :content :icon :key="title">
      <HomepageSectionListRow :title :icon :content />
    </slot>
  </ul>
</template>

<script setup lang="ts">
interface Section {
  id?: string
  title: string
  content: string
  icon?: string
}

interface Props {
  sections: Section[]
}

defineProps<Props>()

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-list {
  list-style: none;
  margin: var(--size-48) 0;
  padding: 0;

  &__item {
    padding: var(--size-24);
    padding-left: var(--size-56);
    max-width: 50ch;
  }
}
</style>