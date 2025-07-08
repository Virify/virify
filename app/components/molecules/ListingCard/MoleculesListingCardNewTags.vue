<template>
  <div class="m-listing-card-tags">
    <span class="m-listing-card-tag | body-xs">Recently Added</span>
    <span class="m-listing-card-tag | body-xs">Reduced</span>
    <span class="m-listing-card-tag | body-xs">Chain Free</span>
  </div>
</template>

<style lang="scss">
.m-listing-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-8);
  margin-bottom: var(--size-8);
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
