<template>
  <div class="o-traditional-search-form | flow flow-4xl">
    <OrganismsTraditionalSearchContract :sale-includes-options :rent-includes-options v-model:is-sale="formData.isSale"
      v-model:min-price="formData.minPrice" v-model:max-price="formData.maxPrice" v-model:price="formData.price"
      v-model:sale-includes="formData.saleIncludes" v-model:rent-includes="formData.rentIncludes"
      id="traditional-search-form-price" />

    <section class="o-traditional-search-form__property-type" id="tradition-search-form-type">
      <h3 class="o-traditional-search-form__title | title-xs">
        Property type
      </h3>

      <OrganismsTraditionalSearchPropertyType v-model="formData.propertyTypes"
        class="o-traditional-search-form__property-type-grid" />
    </section>


    <section class="o-traditional-search-form__room-count" id="tradition-search-form-rooms">
      <h3 class="o-traditional-search-form__title | title-xs">
        Room counts
      </h3>

      <div class="o-traditional-search-form__room-count-grid">
        <MoleculesRoomCount v-model:min-count="formData.minBeds" v-model:max-count="formData.maxBeds" :min="bedroomMin"
          :max="bedroomMax" room-type="bedrooms" />
        <MoleculesRoomCount v-model:min-count="formData.minBathrooms" v-model:max-count="formData.maxBathrooms"
          :min="bathroomMin" :max="bathroomMax" room-type="bathrooms" />
      </div>
    </section>

    <section id="tradition-search-form-features">
      <h3 class="o-traditional-search-form__title | title-xs">
        Additional features
      </h3>

      <ul class="o-traditional-search-form__additional-features">
        <li v-for="{ key, label } of additionalFeatures">
          <AtomsCheckbox v-model="formData.additionalFeatures[key]" :label :name="key" />
        </li>
      </ul>
    </section>

    <AtomsCollapsibleTip class="o-traditional-search-form__tip">
      <h3 class="| title-2xs">Want even more customisability?</h3>

      <p class="| body-sm">
        Why not check out our AI-enhanced search to find your perfect home! Just select the 'AI enhanced' option at
        the top of this form
      </p>
    </AtomsCollapsibleTip>

    <OrganismsTraditionalSearchToolbar class="o-traditional-search-form__toolbar" />
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
interface RoomCount {
  key: number
  value: string
  selected?: boolean
}

const saleIncludesOptions = [
  { key: 'sold-stc', label: 'Include sold STC' },
  { key: 'shared-ownership', label: 'Include shared ownership' },
  { key: 'retirement', label: 'Include retirement properties' },
  { key: 'cash-only', label: 'Include cash-only properties' },
]

const rentIncludesOptions = [
  { key: 'let-agreed', label: 'Include let agreed' },
  { key: 'short-term-lets', label: 'Include short-term lets' },
  { key: 'long-term-lets', label: 'Include long-term lets' },
]

const bedroomMin: RoomCount[] = [
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

const bedroomMax: RoomCount[] = [
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

const bathroomMin: RoomCount[] = [
  { key: 0, value: 'Any', selected: true },
  { key: 1, value: '1' },
  { key: 2, value: '2' },
  { key: 3, value: '3' },
  { key: 4, value: '4' },
  { key: 5, value: '5+' },
]

const bathroomMax: RoomCount[] = [
  { key: 1, value: '1' },
  { key: 2, value: '2' },
  { key: 3, value: '3' },
  { key: 4, value: '4' },
  { key: 5, value: '5' },
  { key: 6, value: 'Any', selected: true }
]

const additionalFeatures = [
  { key: 'garage', label: 'Garage' },
  { key: 'off-street-parking', label: 'Off-street parking' },
  { key: 'disabled-access', label: 'Disability access' },
  { key: 'garden', label: 'Garden' },
  { key: 'pets', label: 'Pet-friendly' },
  { key: 'another-feature', label: 'Another feature' },
  { key: 'and-another', label: 'And another' },
]

/**
 *  Form data
 */
function getDefaultSelected(arr: RoomCount[]) {
  return arr.find(({ selected }) => selected)?.key
}

const formData = useState('search-contract-type', () => reactive({
  isSale: true,
  minPrice: 0,
  maxPrice: 0,
  price: <[number, number]>[0, 0],
  saleIncludes: reactive<{ [key: string]: boolean }>({}),
  rentIncludes: reactive<{ [key: string]: boolean }>({}),
  minBeds: <number>getDefaultSelected(bedroomMin),
  maxBeds: <number>getDefaultSelected(bedroomMax),
  minBathrooms: <number>getDefaultSelected(bathroomMin),
  maxBathrooms: <number>getDefaultSelected(bathroomMax),
  propertyTypes: reactive<{ [key: string]: string[] }>({}),
  additionalFeatures: reactive<{ [key: string]: boolean }>({}),
}))

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

  &__toolbar {
    position: sticky;
    bottom: 0;
  }
}
</style>