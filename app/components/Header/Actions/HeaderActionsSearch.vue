<template>
  <button type="button" @click.prevent="showModal" class="header-actions-search | body-xs" :class="{
    'header-actions-search--shortcut': showShortcut
  }">
    <span role="presentation" class="header-actions-search__text">
      <AtomsIcon icon="search" title="Search" />
      Search
    </span>

    <span v-if="showShortcut" class="header-actions-search__shortcut">
      &#x2318; + K
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  showShortcut?: boolean
}

withDefaults(defineProps<Props>(), {
  showShortcut: false
})

const { showModal } = useGlobalSearch()
</script>

<style lang="scss">
.header-actions-search {
  display: flex;
  margin: 0;
  padding: var(--size-4) var(--size-10);
  align-items: center;
  font-weight: var(--font-bold);
  background: var(--background-200);
  border: 1px solid var(--blue-600);
  line-height: var(--lineheight-sm);
  border-radius: var(--border-radius-lg);
  transition: border-color var(--animation-fast) var(--ease-in-out);
  cursor: pointer;

  &--shortcut {
    padding-right: var(--size-4);
    gap: var(--size-16);
  }

  &:hover {
    border-color: var(--blue-500);
  }

  &__text {
    display: flex;
    align-items: center;
    gap: var(--size-6);
  }

  &__shortcut {
    display: block;
    padding: var(--size-4) var(--size-8);
    background: var(--blue-700);
    border: 1px solid var(--blue-600);
    border-radius: var(--border-radius-md);
  }

  .a-icon {
    display: block;
    width: var(--size-20);
    height: var(--size-20);
  }
}
</style>