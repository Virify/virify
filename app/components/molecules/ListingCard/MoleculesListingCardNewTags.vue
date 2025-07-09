<template>
  <ul class="m-listing-card-tags">
    <li v-for="tag in tags" :key="tag" class="m-listing-card-tag | body-xs">
      {{ tag }}
    </li>
  </ul>
</template>
<script setup lang="ts">
const tags = [
  'Recently Added',
  'Reduced',
  'Chain Free'
]
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
