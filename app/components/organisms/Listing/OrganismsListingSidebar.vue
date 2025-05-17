<template>
  <section role="presentation" class="o-listing-sidebar | flow flow-md">
    <h2 v-if="priceFormatted" class="o-listing-sidebar__title | title-xl lineheight-xs">
      <AtomsPill class="o-listing-sidebar__title-offertype | body-xs">
        Offers in excess of
      </AtomsPill>

      {{ priceFormatted }}
    </h2>

    <p role="presentation" class="o-listing-sidebar__address font-bold | body-md">
      123 House, Somewhere Street
    </p>

    <ul class="o-listing-sidebar__icons | body-sm">
      <li class="o-listing-sidebar__icons-row o-listing-sidebar__icons-row--full">
        <AtomsIcon icon="listings/property-type" aria-hidden class="o-listing-sidebar__icon" />
        House / Student accommodation
      </li>
      <li class="o-listing-sidebar__icons-row">
        <AtomsIcon icon="listings/beds" aria-hidden class="o-listing-sidebar__icon" />
        2 beds
      </li>
      <li class="o-listing-sidebar__icons-row">
        <AtomsIcon icon="listings/bathrooms" aria-hidden class="o-listing-sidebar__icon" />
        3 bathrooms
      </li>
      <li class="o-listing-sidebar__icons-row">
        <AtomsIcon icon="listings/contract" aria-hidden class="o-listing-sidebar__icon" />
        Leasehold
      </li>
    </ul>

    <div class="o-listing-sidebar__agent-details | body-sm">
      Estate agent info

      <address>Email, Phone Number</address>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  price?: number
}

const props = defineProps<Props>()

const priceFormatted = computed(() => {
  const { price } = props

  return isNumber(price) ? numberToCurrency(price) : ''
})
</script>

<style lang="scss">
.o-listing-sidebar {

  &__title {
    margin-bottom: 0;
  }

  &__title-offertype {
    display: block;
    text-align: left;
    margin-bottom: var(--size-4);
  }

  &__address {
    margin: 0;
  }

  &__icons {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, auto);
    padding: 0;
    border-radius: var(--border-radius-2xl);
    margin-inline: 0;
    gap: var(--size-6);
  }

  &__icons-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--size-6);

    &--full {
      grid-column: span 3;
    }
  }

  &__icon {
    display: block;
    width: var(--size-20);
    height: var(--size-20);
  }

  &__agent-details {
    background: var(--blue-300);
    color: var(--monochrome-900);
    border-radius: var(--border-radius-2xl);
    padding: var(--size-16) var(--size-24);
  }
}
</style>