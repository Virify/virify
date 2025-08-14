<template>
  <ul class="m-autocomplete-list | r-body-md-xs">
    <li v-for="option, index of options" class="m-autocomplete-list__row" :key="index">
      <slot v-bind="{
        option,
        rowClass: 'm-autocomplete-list__select',
        actionClass: 'm-autocomplete-list__action'
      }"></slot>
    </li>
  </ul>
</template>

<script setup lang="ts" generic="T">
interface Props<T> {
  options: T[]
}

defineProps<Props<T>>()
</script>

<style lang="scss">
.m-autocomplete-list {
  list-style: none;
  padding: 0;
  margin: 0;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--size-12) var(--size-14);
    margin: 0;
    border: 0;
    gap: var(--size-14);

    &:not(:first-child) {
      border-top: 1px solid var(--border-color-200);
    }

    &:has(.m-autocomplete-list__select:hover) {
      background: var(--background-100);
    }
  }

  :where(& button) {
    padding: 0;
    margin: 0;
    border: 0;
    background: transparent;
    color: currentColor;
    transition: background-color var(--animation-fast);
  }

  &__select {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
    text-align: left;
  }

  &__action {
    display: flex;
    align-items: center;
    transition: color var(--animation-fast);

    &:hover {
      color: var(--secondary-400);
    }

    svg {
      width: var(--size-24);
      height: var(--size-24);
    }
  }
}
</style>