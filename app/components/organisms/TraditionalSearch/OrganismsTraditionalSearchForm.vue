<template>
  <div class="o-traditional-search-form | flow flow-xl">
    <div>
      <h3 class="| title-2xs">Contract type</h3>

      <div style="display: flex; justify-content: space-evenly; width: 100%; gap: var(--size-12)">
        <MoleculesSwitcher class="o-searchform-buyrent" legend="Buy or rent" :options="buyOrRentOptions"
          v-model="searchData.buyOrRent" name="buyOrRent" />

        <AtomsCheckbox v-if="searchData.buyOrRent === 'buy'" label="Include sold STC?" />
        <AtomsCheckbox v-else label="Include let agreed?" />
      </div>
    </div>

    <div>
      <h3 class="| title-2xs">Price</h3>

      <LazyMoleculesRangeSlider v-model="selectedPriceRange" :min="searchData.min" :max="searchData.max"
        :starting-min="searchData.min" :starting-max="searchData.max" :graph-data="priceRangeGraph"
        hydrate-on-visible />
    </div>

    <div>
      <h3 class="| title-2xs">Property type</h3>

      <OrganismsTraditionalSearchPropertyType />
    </div>

    <div style="display: flex; justify-content: space-evenly; width: 100%; gap: var(--size-12)">
      <div>
        <h3 class="| title-2xs">Bed count</h3>
        <p>Coming soon...</p>
      </div>

      <div>
        <h3 class="| title-2xs">Bathroom count</h3>
        <p>Coming soon...</p>
      </div>
    </div>

    <div>
      <h3 class="| title-2xs">Additional features</h3>
      <p>Coming soon...</p>
    </div>
  </div>
</template>

<script setup lang="ts">

/**
 *  Get static options
 */
const { buyOrRentOptions } = getSearchFormConfig();

/**
 *  Search data model
 */
const searchData = reactive({
  buyOrRent: useState('buy-or-rent', () => 'buy'),
  min: 0,
  max: 100
})

const selectedPriceRange = ref<[number, number]>([10, 50])

/**
 *  Graph data
 */
const { data: priceRangeGraph } = useAsyncData('price-graph', () => {
  return $fetch<string[]>("/api/price/graph/", {
    params: {
      listingType: searchData.buyOrRent
    }
  })
}, {
  watch: [() => searchData.buyOrRent]
})

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-traditional-search-form {
  padding: var(--size-8);

  @include mq.tablet {
    padding: var(--size-16);
  }
}
</style>