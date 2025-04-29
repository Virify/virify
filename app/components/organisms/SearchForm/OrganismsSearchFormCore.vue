<template>
  <div class="o-searchform-core">
    <select class="o-searchform-input">
      <option value="Buy">Buy</option>
      <option value="Rent">Rent</option>
    </select>

    <input type="text" placeholder="Location" class="o-searchform-input" @input="searchInput" v-model="currentSearch" />

    <select class="o-searchform-input">
      <option value="0">0 miles</option>
      <option value="0.25">0.25 miles</option>
      <option value="0.5">0.5 miles</option>
      <option value="1">1 mile</option>
      <option value="2">2 miles</option>
      <option value="5">5 miles</option>
      <option value="10">10 miles</option>
      <option value="20">20 miles</option>
      <option value="40">40 miles</option>
    </select>

    <button type="button" class="o-searchform-core-button | button button-monochrome">
      <AtomsIcon title="Search" icon="search" class="o-searchform-core-button-icon" />
    </button>
  </div>
</template>

<script setup>
import { useDebounceFn } from '@vueuse/core';

const emits = defineEmits(['search-input'])

const searchInput = useDebounceFn(({ target }) => {
  emits('search-input', target.value)
}, 200)

const currentSearch = defineModel({ default: '' })
</script>

<style>
.o-searchform-core {
  display: flex;
  align-items: center;
  gap: var(--size-8);
}

.o-searchform-input {
  flex: 0 1 min-content;
  width: auto;
  min-width: 0;
}

.o-searchform-core-button {
  width: var(--size-56);
  height: var(--size-56);
  padding: 0;
  flex-shrink: 0;
  border-radius: var(--border-radius-ui);
}

.o-searchform-core-button-icon {
  width: var(--size-24);
  height: var(--size-24);
}
</style>