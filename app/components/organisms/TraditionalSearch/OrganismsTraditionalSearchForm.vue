<template>
  <div class="o-traditional-search-form | flow flow-4xl">
    <OrganismsTraditionalSearchContract />

    <div class="o-traditional-search-form__property-type">
      <h3 class="o-traditional-search-form__title | title-xs">
        Property type
      </h3>

      <OrganismsTraditionalSearchPropertyType class="o-traditional-search-form__property-type-grid" />
    </div>


    <div class="o-traditional-search-form__room-count">
      <h3 class="o-traditional-search-form__title | title-xs">
        Room counts
      </h3>

      <div class="o-traditional-search-form__room-count-grid">
        <MoleculesRoomCount :min="bedroomMin" :max="bedroomMax" room-type="bedrooms" />
        <MoleculesRoomCount :min="bathroomMin" :max="bathroomMax" room-type="bathrooms" />
      </div>
    </div>

    <div>
      <h3 class="o-traditional-search-form__title | title-xs">
        Additional features
      </h3>

      <ul class="o-traditional-search-form__additional-features">
        <li v-for="feature of additionalFeatures">
          <AtomsCheckbox :label="feature" />
        </li>
      </ul>

      <AtomsCollapsibleTip class="o-traditional-search-form__tip">
        <h3 class="| title-2xs">Want even more customisability?</h3>

        <p class="| body-sm">
          Why not check out our AI-enhanced search to find your perfect home! Just select the 'AI enhanced' option at
          the top of this form
        </p>
      </AtomsCollapsibleTip>
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['is-loaded'])

onBeforeMount(() => {
  emits('is-loaded', true)
})

/**
 *  Data
 */
const bedroomMin = [
  { key: 0, value: 'Any', selected: true },
  { key: 0.5, value: 'Studio' },
  { key: 1, value: '1' },
  { key: 2, value: '2' },
  { key: 3, value: '3' },
  { key: 4, value: '4' },
  { key: 5, value: '5' },
  { key: 6, value: '6' },
  { key: 7, value: '7' },
  { key: 8, value: '8+' }
]

const bedroomMax = [
  { key: 0.5, value: 'Studio' },
  { key: 1, value: '1' },
  { key: 2, value: '2' },
  { key: 3, value: '3' },
  { key: 4, value: '4' },
  { key: 5, value: '5' },
  { key: 6, value: '6' },
  { key: 7, value: '7' },
  { key: 8, value: '8' },
  { key: 9, value: 'Any', selected: true }
]

const bathroomMin = [
  { key: 0, value: 'Any', selected: true },
  { key: 1, value: '1' },
  { key: 2, value: '2' },
  { key: 3, value: '3' },
  { key: 4, value: '4' },
  { key: 5, value: '5+' },
]

const bathroomMax = [
  { key: 1, value: '1' },
  { key: 2, value: '2' },
  { key: 3, value: '3' },
  { key: 4, value: '4' },
  { key: 5, value: '5' },
  { key: 6, value: 'Any', selected: true }
]

const additionalFeatures = [
  'Garage',
  'Off-street parking',
  'Disability access',
  'Garden',
  'Pet-friendly',
  'Another feature',
  'And another',
]
</script>

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

  &__room-count-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-32);
  }

  &__additional-features {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
    gap: var(--size-8);
  }

  &__tip {
    margin: var(--size-24) 0 0;
  }
}
</style>