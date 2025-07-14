<template>
  <slot :tags="tags">
    <ul class="m-listing-card-tags">
      <li v-for="tag in tags" :key="tag" class="m-listing-card-tag | body-xs">
        {{ tag }}
      </li>
    </ul>
  </slot>
</template>
<script setup lang="ts">

const props = defineProps<{
  chainFree: boolean;
  listedDate: Date | string;
  reduced: boolean;
}>();

const tags: string[] = [];
const createdAt = new Date(props.listedDate);
const now = new Date();
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

if (createdAt >= oneWeekAgo) {
  tags.push('Recently Added');
}

if (props.reduced) {
  tags.push('Reduced');
}
if (props.chainFree) {
  tags.push('Chain Free');
}


</script>

<style lang="scss">
ul {
  margin: 0;
}

.m-listing-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-8);
  list-style: none;
  margin-bottom: var(--size-8);
  padding: 0;
}

.m-listing-card-tag {
  padding-right: var(--size-8);
  background-color: var(--background-300);
  padding: var(--size-8);
  border-radius: var(--border-radius-lg);
}

@media (max-width: 768px) {
  .m-listing-card-tags {
    display: none;
  }
}
</style>
