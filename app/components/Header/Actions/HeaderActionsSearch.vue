<template>
  <button type="button" @click.prevent="showModal" class="header-actions-search | body-xs" :class="{
    'header-actions-search--shortcut': showShortcut
  }">
    <span role="presentation" class="header-actions-search__text">
      <AtomsIcon icon="search" title="Search" />
      Search
    </span>

    <span v-if="showShortcut" class="header-actions-search__shortcut">
      <AtomsMetaKey class="header-actions-search__shortcut-key" /> + K
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
  border: 1px solid light-dark(var(--blue-600), var(--blue-500));
  line-height: var(--lineheight-sm);
  border-radius: var(--border-radius-lg);
  transition: border-color var(--animation-fast) var(--ease-in-out);
  cursor: pointer;

  &--shortcut {
    padding-right: var(--size-4);
    gap: var(--size-16);
  }

  &:hover {
    border-color: var(--blue-600);
  }

  &__text {
    display: flex;
    align-items: center;
    gap: var(--size-6);

    .a-icon {
      display: block;
      width: var(--size-20);
      height: var(--size-20);
    }
  }

  &__shortcut {
    display: flex;
    align-items: center;
    gap: 0.25ch;
    padding: var(--size-4) var(--size-8);
    background: light-dark(var(--blue-700), var(--blue-400));
    border: 1px solid light-dark(var(--blue-600), var(--blue-500));
    border-radius: var(--border-radius-md);
  }
}
</style>