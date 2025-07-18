<template>
  <ul class="o-listing-sidebar-icons | body-sm">
    <li
      v-if="propertyType"
      class="o-listing-sidebar-icons__row o-listing-sidebar-icons__row--full"
    >
      <AtomsIcon
        :icon="getPropertyTypeIcon(propertyType)"
        aria-hidden
        class="o-listing-sidebar-icons__icon"
      />
      {{ propertyType }}
    </li>

    <li v-if="classification" class="o-listing-sidebar-icons__row">
      <AtomsIcon
        :icon="getClassificationIcon(classification)"
        aria-hidden
        class="o-listing-sidebar-icons__icon"
      />
      {{ classification }}
    </li>

    <li v-if="bedrooms" class="o-listing-sidebar-icons__row">
      <AtomsIcon
        icon="listings/beds"
        aria-hidden
        class="o-listing-sidebar-icons__icon"
      />
      {{ bedrooms }} bed{{ bedrooms !== 1 ? "s" : "" }}
    </li>

    <li v-if="bathrooms" class="o-listing-sidebar-icons__row">
      <AtomsIcon
        icon="listings/bathrooms"
        aria-hidden
        class="o-listing-sidebar-icons__icon"
      />
      {{ bathrooms }} bathroom{{ bathrooms !== 1 ? "s" : "" }}
    </li>

    <li v-if="receptions" class="o-listing-sidebar-icons__row">
      <AtomsIcon
        icon="property/receptions"
        aria-hidden
        class="o-listing-sidebar-icons__icon"
      />
      {{ receptions }} reception{{ receptions !== 1 ? "s" : "" }}
    </li>
  </ul>
</template>

<script setup lang="ts">

interface Props {
  propertyType?: string;
  propertySize?: number;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  receptions?: number;
  classification?: string;
}

defineProps<Props>();
</script>

<style lang="scss">
.o-listing-sidebar-icons {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  border-radius: var(--border-radius-2xl);
  margin-inline: 0;
  gap: var(--size-8);

  &__row {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    justify-content: space-evenly;
  }

  &__icon {
    display: block;
    width: var(--size-20);
    height: var(--size-20);
  }
}
</style>
