<template>
  <div role="presentation" class="| flow flow-lg">
    <MoleculesAiSearchFormLocation />

    <OrganismsFilterSwitcher class="search-form-modal__switcher">
      <template v-slot:traditional>
        <p>Traditional</p>
      </template>

      <template v-slot:ai>
        <p>AI</p>
      </template>
    </OrganismsFilterSwitcher>

    <button @click.prevent="triggerSearch" class="| button">Search</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['trigger-search'])

function triggerSearch() {
  emit('trigger-search')
}

/**
 *  Show additional fo
 */
</script>

<style lang="scss">
.search-form-modal {

  &__switcher {
    interpolate-size: allow-keywords;

    height: calc-size(max-content, size);
    transition: height, margin;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-out);
    overflow: hidden;

    @starting-style {
      height: 0;
      margin: 0;
    }
  }
}
</style>