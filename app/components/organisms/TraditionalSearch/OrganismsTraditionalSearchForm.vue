<template>
  <div class="o-traditional-search-form | flow flow-xl">
    <OrganismsTraditionalSearchContract />

    <div class="o-traditional-search-form__property-type">
      <h3 class="o-traditional-search-form__title | title-xs">Property type</h3>

      <OrganismsTraditionalSearchPropertyType class="o-traditional-search-form__property-type-grid" />
    </div>

    <div class="o-traditional-search-form__room-count">
      <div>
        <h3 class="o-traditional-search-form__title | title-xs">Bed count</h3>
        <AtomsNumberRange />
      </div>

      <div>
        <h3 class="o-traditional-search-form__title | title-xs">Bathroom count</h3>
        <AtomsNumberRange />
      </div>
    </div>

    <div>
      <h3 class="o-traditional-search-form__title | title-2xs">Additional features</h3>
      <p>Coming soon...</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-traditional-search-form {

  &__title {
    text-align: center;
    margin: 0 0 var(--size-16);
  }

  &__property-type-grid {
    text-align: left;
  }

  &__room-count {
    display: grid;
    gap: var(--size-16);

    @include mq.small-tablet {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>