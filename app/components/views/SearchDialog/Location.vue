<template>
  <div class="| flow">
    <h2 class="| title-md">Location</h2>

    <div tabindex="-1" @focusin="showSuggestions" @focusout="hideSuggestions" class=" | flow">
      <label class="| faded-text body-sm">
        Example input
        <input type="text" class="| text-input body-md">
      </label>

      <div :hidden="!isSuggestion" class="v-search-dialog-location__animate-height | flow">
        <h3 class="| title-xs">Locations</h3>

        <ul class="v-search-dialog-location__autocomplete">
          <li v-for="i of 5" class="v-search-dialog-location__autocomplete-row | body-md">
            Suggestion {{ i }}
          </li>
        </ul>

        <h3 class="| title-xs">History</h3>

        <ul class="v-search-dialog-location__autocomplete">
          <li v-for="i of 3" class="v-search-dialog-location__autocomplete-row | body-md">
            History {{ i }}
          </li>
        </ul>
      </div>
    </div>

    <label class="| faded-text body-sm">
      Another example
      <input type="text" class="| text-input body-md">
    </label>

    <div class="v-search-dialog-location__buttons">
      <button class="| button button-sm button-ghost">Filters</button>
      <button class="| button button-sm button-secondary">Show results</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const isSuggestion = shallowRef(false)

function showSuggestions() {
  isSuggestion.value = true
}

function hideSuggestions() {
  isSuggestion.value = false
}

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.v-search-dialog-location {

  &__animate-height {
    padding: var(--size-32) 0;
    interpolate-size: allow-keywords;

    transition: all var(--animation-veryslow);
    overflow: hidden;

    @starting-style {
      height: 0;
      padding-top: 0;
      padding-bottom: 0;
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &__autocomplete {
    list-style: none;
    padding: 0;
    margin: var(--size-16) 0 var(--size-32);
    border-top: 1px solid var(--border-color-200);

  }

  &__autocomplete-row {
    padding: var(--size-10) var(--size-16);
    border-bottom: 1px solid var(--border-color-200);
  }

  &__buttons {
    display: flex;
    padding: var(--size-8) 0 0;
    align-items: center;
    justify-content: flex-end;
    gap: var(--size-8);

    @include mq.tablet {
      display: none;
    }
  }
}
</style>