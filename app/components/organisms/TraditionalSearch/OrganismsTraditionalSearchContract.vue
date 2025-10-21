<template>
  <div role="presentation" class="o-traditional-search-form-contract | flow flow-lg">
    <nav>
      <ul class="o-traditional-search-form-contract__menu">
        <li class="o-traditional-search-form-contract__menu-item">
          <button type="button" :aria-expanded="!contractType.buyOrRent"
            aria-controls="o-traditional-search-form-contract-buy"
            class="o-traditional-search-form-contract__menu-button | button button-ghost"
            @click.prevent="updateIsBuy(true)">
            Buy
          </button>
        </li>

        <li class="o-traditional-search-form-contract__menu-item">
          <button type="button" :aria-expanded="contractType.buyOrRent"
            aria-controls="o-traditional-search-form-contract-rent"
            class="o-traditional-search-form-contract__menu-button | button button-ghost"
            @click.prevent="updateIsBuy(false)">
            Rent
          </button>
        </li>
      </ul>
    </nav>

    <section id="o-traditional-search-form-contract-buy" class="o-traditional-search-form-contract__content"
      :hidden="contractType.buyOrRent">

      <AtomsCheckbox label="Include sold STC" />
      <AtomsCheckbox label="Include shared ownership" />
      <AtomsCheckbox label="Include retirement properties" />
      <AtomsCheckbox label="Include cash-only properties" />
    </section>

    <section id="o-traditional-search-form-contract-rent" class="o-traditional-search-form-contract__content"
      :hidden="!contractType.buyOrRent">

      <AtomsCheckbox label="Include let agreed" />
      <AtomsCheckbox label="Include short-term lets" />
      <AtomsCheckbox label="Include long-term lets" />
    </section>

    <div class="o-traditional-search-form-contract__price">
      <h3 class="| title-2xs">Price</h3>

      <LazyMoleculesRangeSlider v-model="selectedPriceRange" :min="contractType.min" :max="contractType.max"
        :starting-min="contractType.min" :starting-max="contractType.max" :graph-data="priceRangeGraph"
        hydrate-on-visible />
    </div>
  </div>
</template>

<script setup lang="ts">

/**
 *  Search data model
 */
const contractType = useState('search-contract-type', () => reactive({
  buyOrRent: false,
  min: 0,
  max: 100
}))

const selectedPriceRange = ref<[number, number]>([10, 50])

/**
 *  Graph data
 */
const { data: priceRangeGraph } = useAsyncData('price-graph', () => {
  return $fetch<string[]>("/api/price/graph/", {
    params: {
      listingType: contractType.value.buyOrRent ? 'buy' : 'rent'
    }
  })
}, {
  watch: [() => contractType.value.buyOrRent]
})

/**
 *  Tabs for buy/rent
 */
function updateIsBuy(newValue: boolean) {
  contractType.value.buyOrRent = !newValue
}
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-traditional-search-form-contract {
  border: 1px solid var(--border-color-200);
  border-radius: var(--border-radius-2xl);
  padding: var(--size-16);
  background: var(--background-100);

  @include mq.tablet {
    padding: var(--size-20);
  }

  @include mq.notebook {
    padding: var(--size-24);
  }

  &__menu {
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;
    gap: var(--size-8);
  }

  &__menu-item {
    display: block;
    flex-grow: 1;
  }

  &__menu-button {
    background: none;
    padding: var(--size-8) var(--size-16);
    border-radius: var(--border-radius-lg);
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    background: transparent;
    border-bottom: 0;

    &[aria-expanded=true] {
      background: var(--secondary-500);
      color: var(--monochrome-100);
    }
  }

  &__content {
    padding: var(--size-16) 0;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: var(--size-8);

    :where(&) {
      display: flex;
    }
  }
}
</style>