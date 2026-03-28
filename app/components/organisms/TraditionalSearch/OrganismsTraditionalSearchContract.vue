<template>
  <div role="presentation" class="o-traditional-search-form-contract">
    <nav>
      <ul class="o-traditional-search-form-contract__menu">
        <li class="o-traditional-search-form-contract__menu-item">
          <button type="button" :aria-expanded="isSale" aria-controls="o-traditional-search-form-contract-buy"
            class="o-traditional-search-form-contract__menu-button | button button-none"
            @click.prevent="updateIsBuy(true)">
            To Buy
          </button>
        </li>

        <li class="o-traditional-search-form-contract__menu-item">
          <button type="button" :aria-expanded="!isSale" aria-controls="o-traditional-search-form-contract-rent"
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
        :hidden="!isSale">

        <AtomsChecktext v-for="{ key, label } of saleIncludesOptions" v-model="saleIncludes[key]" :label="label"
          :name="key" />
      </section>

      <section id="o-traditional-search-form-contract-rent" class="o-traditional-search-form-contract__content-block"
        :hidden="isSale">

        <AtomsChecktext v-for="{ key, label } of rentIncludesOptions" v-model="rentIncludes[key]" :label="label"
          :name="key" />
      </section>

      <section class="o-traditional-search-form-contract__price">
        <h3 class="o-traditional-search-form-contract__title | title-xs">
          Price
        </h3>

        <MoleculesRangeSlider class="o-traditional-search-form-contract__price-slider" v-model="price" :min="minPrice"
          :max="maxPrice" :graph-data="priceGraph" :loading="priceGraphLoading" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">

interface IncludesOption {
  key: string,
  label: string
}

interface IncludeChecked {
  [key: string]: unknown
}

interface Props {
  saleIncludesOptions: IncludesOption[]
  rentIncludesOptions: IncludesOption[]
}

defineProps<Props>()

/**
 *  Models
 */
const isSale = defineModel<boolean>('is-sale', {
  default: true
})

const minPrice = defineModel<number>('min-price', {
  default: 0
})

const maxPrice = defineModel<number>('max-price', {
  default: 0
})

const price = defineModel<[number, number]>('price', {
  default: [0, 0]
})

const saleIncludes = defineModel<IncludeChecked>('sale-includes', {
  default: reactive({})
})

const rentIncludes = defineModel<IncludeChecked>('rent-includes', {
  default: reactive({})
})

/**
 *  Graph data
 *  @TODO combine these into 1 endpoint
 */
const { data: priceGraph, pending: priceGraphLoading } = useAsyncData('price-graph', () => {
  return $fetch<string[]>("/api/price/graph/", {
    params: {
      listingType: isSale.value ? 'buy' : 'rent'
    }
  })
}, {
  watch: [isSale]
})

const { data: priceMinMax } = useAsyncData('price-min-max', () => {
  return $fetch<string[]>("/api/price/min-max/")
})

watch([priceMinMax, isSale], () => {
  const { sale, rental } = asObject(priceMinMax.value)
  const [min, max] = asArray(isSale.value ? sale : rental, true)

  const minNumber = Number(min)
  const maxNumber = Number(max)

  minPrice.value = minNumber
  maxPrice.value = maxNumber
  price.value = [minNumber, maxNumber]
})

/**
 *  Tabs for buy/rent
 */
function updateIsBuy(newValue: boolean) {
  isSale.value = newValue
}

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;
@use '#styles/_utils/functions' as fn;

.o-traditional-search-form-contract {
  --search-form-background: linear-gradient(to bottom,
      var(--blue-300),
      light-dark(var(--blue-100), var(--background-100)));
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
      --tab-bg: var(--blue-300);
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
    --track-fill-color: var(--primary-500);
    --track-thumb-color: var(--primary-500);
    --track-thumb-border: none;
  }

  .m-range-slider__label-min,
  .m-range-slider__label-max {
    width: fit-content;
  }

  .m-range-slider__label-max {
    margin-left: auto;
  }

  .m-range-slider__input {
    background: var(--blue-300);
    color: var(--monochrome-900);
    border-width: 2px;

    &:focus {
      outline: none;
      border-color: var(--primary-500);
    }
  }
}
</style>