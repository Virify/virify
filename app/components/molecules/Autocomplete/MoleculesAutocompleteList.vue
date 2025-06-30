<template>
  <ul class="m-autocomplete-list | body-md">
    <li v-for="option of options" class="m-autocomplete-list__row" key="option">
      <button type="button" class="m-autocomplete-list__select" @click="$emit('selectedLocation', option)">
        {{ option.place_name_en }}
      </button>

      <button type="button" aria-label="Save pin" class="m-autocomplete-list__action" :class="{
        '| faded-text': variant === 'faded-icon'
      }">
        <AtomsIcon :icon @click="$emit('removeHistory', option)" />
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  options: GeocodingFeature[]
  icon?: string
  variant?: 'faded-icon'
}

withDefaults(defineProps<Props>(), {
  icon: 'search/ping'
})

defineEmits<{
  (e: 'removeHistory', value: GeocodingFeature): void
  (e: 'selectedLocation', value: GeocodingFeature): void
}>()
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