<template>
  <div role="presentation" class="o-traditional-search-form-contract">
    <nav>
      <ul class="o-traditional-search-form-contract__menu">
        <li class="o-traditional-search-form-contract__menu-item">
          <button type="button" :aria-expanded="!contractType.isSale"
            aria-controls="o-traditional-search-form-contract-buy"
            class="o-traditional-search-form-contract__menu-button | button button-none"
            @click.prevent="updateIsBuy(true)">
            To Buy
          </button>
        </li>

        <li class="o-traditional-search-form-contract__menu-item">
          <button type="button" :aria-expanded="contractType.isSale"
            aria-controls="o-traditional-search-form-contract-rent"
            class="o-traditional-search-form-contract__menu-button | button button-none"
            @click.prevent="updateIsBuy(false)">
            To Rent
          </button>
        </li>
      </ul>
    </nav>

    <div role="presentation" class="o-traditional-search-form-contract__content">
      <h3 class="o-traditional-search-form-contract__title | title-xs">
        Include
      </h3>

      <section id="o-traditional-search-form-contract-buy" class="o-traditional-search-form-contract__content-block"
        :hidden="contractType.isSale">

        <AtomsChecktext label="Include sold STC" />
        <AtomsChecktext label="Include shared ownership" />
        <AtomsChecktext label="Include retirement properties" />
        <AtomsChecktext label="Include cash-only properties" />
      </section>

      <section id="o-traditional-search-form-contract-rent" class="o-traditional-search-form-contract__content-block"
        :hidden="!contractType.isSale">

        <AtomsChecktext label="Include let agreed" />
        <AtomsChecktext label="Include short-term lets" />
        <AtomsChecktext label="Include long-term lets" />
      </section>

      <section class="o-traditional-search-form-contract__price">
        <h3 class="o-traditional-search-form-contract__title | title-xs">
          Price
        </h3>

        <MoleculesRangeSlider class="o-traditional-search-form-contract__price-slider" v-model="contractType.price"
          :min="contractType.minPrice" :max="contractType.maxPrice" :graph-data="priceGraph"
          :loading="priceGraphLoading" hydrate-on-visible />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">

/**
 *  Search data model
 */
const contractType = useState('search-contract-type', () => reactive({
  isSale: false,
  minPrice: 0,
  maxPrice: 0,
  price: <[number, number]>[0, 0]
}))

/**
 *  Graph data
 *  @TODO combine these into 1 endpoint
 */
const { data: priceGraph, pending: priceGraphLoading } = useAsyncData('price-graph', () => {
  return $fetch<string[]>("/api/price/graph/", {
    params: {
      listingType: contractType.value.isSale ? 'buy' : 'rent'
    }
  })
}, {
  watch: [() => contractType.value.isSale]
})

const { data: priceMinMax } = useAsyncData('price-min-max', () => {
  return $fetch<string[]>("/api/price/min-max/")
})

watch([priceMinMax, () => contractType.value.isSale], () => {
  const { sale, rental } = asObject(priceMinMax.value)
  const [min, max] = asArray(contractType.value.isSale ? sale : rental, true)

  const minNumber = Number(min)
  const maxNumber = Number(max)

  contractType.value.minPrice = minNumber
  contractType.value.maxPrice = maxNumber
  contractType.value.price = [minNumber, maxNumber]
})

/**
 *  Tabs for buy/rent
 */
function updateIsBuy(newValue: boolean) {
  contractType.value.isSale = !newValue
}

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;
@use '#styles/_utils/functions' as fn;

.o-traditional-search-form-contract {
  --search-form-background: linear-gradient(to bottom, var(--blue-400), var(--blue-300));
  --search-form-foreground: var(--monochrome-900);

  &__title {
    margin-bottom: var(--size-16);
  }

  &__menu {
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;
    align-items: flex-end;
    justify-content: center;
  }

  &__menu-item {
    display: block;
  }

  &__menu-button {
    --tab-bg: transparent;
    --tab-colour: var(--foreground-200);
    --tab-size: var(--border-radius-2xl);

    position: relative;
    background: none;
    padding: var(--size-8) var(--size-16);
    text-align: center;
    border-radius: 0;
    border-top-left-radius: var(--tab-size);
    border-top-right-radius: var(--tab-size);
    margin: 0;
    width: 100%;
    min-width: 12ch;
    min-height: calc(2 * var(--tab-size));
    box-sizing: border-box;
    background: var(--tab-bg);
    color: var(--tab-colour);
    border-bottom: 0;
    font-size: var(--font-sm);

    &:hover {
      --tab-bg: var(--background-300);
      --tab-colour: var(--foreground-200);
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: var(--tab-size);
      height: var(--tab-size);
      bottom: 0;
    }

    &::before {
      background: radial-gradient(circle at 0 0, transparent var(--tab-size), var(--tab-bg) var(--tab-size));
      right: 100%;
    }

    &::after {
      background: radial-gradient(circle at 100% 0, transparent var(--tab-size), var(--tab-bg) var(--tab-size));
      left: 100%;
    }

    &,
    &::before,
    &::after {
      transition: none;
    }

    &[aria-expanded=true],
    &[aria-expanded=true]:hover {
      --tab-bg: var(--blue-400);
      --tab-colour: var(--monochrome-900);

      z-index: 2;
    }
  }

  &__content {
    border-radius: var(--border-radius-2xl);
    padding: var(--size-20);
    background: var(--search-form-background);
    color: var(--search-form-foreground);

    @include mq.small-tablet {
      padding: var(--size-24);
    }

    @include mq.tablet {
      padding: var(--size-32);
    }
  }

  &__content-block {
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    row-gap: var(--size-12);
    column-gap: var(--size-24);
    margin: 0 0 var(--size-40);

    @include mq.tablet {
      grid-template-columns: 1fr 1fr;
    }

    :where(&) {
      display: grid;
    }
  }

  &__price-slider {
    --track-empty-color: var(--blue-500);
    --track-fill-color: var(--secondary-500);
    --track-thumb-color: var(--secondary-500);
    --track-thumb-border: none;
  }

  .m-range-slider-input {
    background: var(--blue-400);
    color: var(--monochrome-900);
    border-width: 2px;

    &:focus {
      outline: none;
      border-color: var(--secondary-500);
    }
  }
}
</style>