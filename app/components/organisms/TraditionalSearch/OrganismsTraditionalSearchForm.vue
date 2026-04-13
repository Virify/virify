<template>
  <form class="o-traditional-search-form | flow flow-4xl" @submit.prevent="postFormData">
    <OrganismsTraditionalSearchContract :sale-includes-options :rent-includes-options v-model:is-sale="formData.isSale"
      v-model:min-price="formData.minPrice" v-model:max-price="formData.maxPrice" v-model:price="formData.price"
      v-model:sale-includes="formData.saleIncludes" v-model:rent-includes="formData.rentIncludes" :id="priceId" />

    <section class="o-traditional-search-form__property-type" :id="propertyTypeId">
      <h3 class="o-traditional-search-form__title | title-xs">
        Property type
      </h3>

      <OrganismsTraditionalSearchPropertyType v-model="formData.propertyTypes"
        class="o-traditional-search-form__property-type-grid" />
    </section>

    <section class="o-traditional-search-form__room-count" :id="roomCountId">
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

    <section class="o-traditional-search-form__property-size" :id="sizeId">
      <h3 class="o-traditional-search-form__title | title-xs">
        Size
      </h3>

      <div class="o-traditional-search-form__property-size-grid">

        <OrganismsTraditionalSearchTextInput label="min size" name="minSize" type="number" v-model="formData.minSize"
          :input-attributes="sizesInputAttributes" />

        <OrganismsTraditionalSearchTextInput label="Max size" name="maxSize" type="number" v-model="formData.maxSize"
          :input-attributes="sizesInputAttributes" />

        <OrganismsTraditionalSearchSelectInput label="Unit" name="sizeUnit" v-model="formData.sizeUnit"
          :options="sizes" />
      </div>
    </section>

    <section :id="featuresId">
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

    <OrganismsTraditionalSearchToolbar :links="jumpLinks" class="o-traditional-search-form__toolbar" />
  </form>
</template>

<script setup lang="ts">
const emits = defineEmits(['is-loaded', 'submit-search'])

onBeforeMount(() => {
  emits('is-loaded', true)
})

/**
 *  Data
 */
type PropertySizeUnits = 'sqmtr' | 'sqft'

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
]

const sizes = [
  { value: 'sqmtr', key: 'Square metre' },
  { value: 'sqft', key: 'Square feet' },
]

const sizesInputAttributes = {
  min: 0,
  step: 1
}

/**
 *  Jumplinks
 */
const jumpLinks: JumpLink[] = [
  {
    order: 1,
    icon: 'jumplinks/price',
    title: 'Price',
    id: 'traditional-search-form-price'
  },
  {
    order: 2,
    icon: 'jumplinks/property-type',
    title: 'Property',
    id: 'tradition-search-form-type'
  },
  {
    order: 3,
    icon: 'jumplinks/room-count',
    title: 'Rooms',
    id: 'tradition-search-form-rooms'
  },
  {
    order: 4,
    icon: 'jumplinks/size',
    title: 'Size',
    id: 'tradition-search-size'
  },
  {
    order: 5,
    icon: 'jumplinks/additional-features',
    title: 'Features',
    id: 'tradition-search-form-features'
  },
]

// Get list of IDs
const [
  priceId,
  propertyTypeId,
  roomCountId,
  sizeId,
  featuresId
] = jumpLinks.map(({ id }) => id as string)

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
  minSize: <number | null>0,
  maxSize: <number | null>null,
  sizeUnit: <PropertySizeUnits>'sqmtr',
  propertyTypes: reactive<{ [key: string]: string[] }>({}),
  additionalFeatures: reactive<{ [key: string]: boolean }>({}),
}))

/**
 *  Handle post
 */
function postFormData() {
  emits('submit-search', formData.value);
}

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

  &__property-size-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 14ch;
    gap: var(--size-12);

    @include mq.tablet {
      grid-template-columns: auto auto 1fr;
    }
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