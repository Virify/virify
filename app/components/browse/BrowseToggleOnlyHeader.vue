<template>
  <form class="browse-toggle-only-header">
    <label>
      <span class="| visually-hidden">Buy or rent?</span>

      <MoleculesSwitcher :options="buyOrRent" init-selected="buy" class="browse-toggle-only-header__input"
        v-model="selection" />
    </label>
  </form>
</template>

<script setup lang="ts">
const buyOrRent = [
  { key: 'buy', value: 'Buy' },
  { key: 'rent', value: 'Rent' },
]

const selection = defineModel<'buy' | 'rent'>({
  default: 'buy'
})
</script>

<style lang="scss">
@use "#styles/_utils/functions" as fn;

.browse-toggle-only-header {
  position: sticky;
  top: calc(var(--size-8) + var(--header-height));
  margin: var(--size-16) auto var(--size-24);
  max-width: 20ch;

  &__input {
    background: var(--background-100);
  }
}
</style>