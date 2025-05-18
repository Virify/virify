<template>
  <div class="o-listing-mobile-banner" role="presentation">
    <div class="| container flow flow-xs" role="presentation">
      <div role="presentation">
        <h2 v-if="price" class="o-listing-mobile-banner__title | title-md lineheight-xs">
          {{ price }}

          <AtomsPill class="o-listing-mobile-banner__title-offertype | body-xs">
            Offers in excess of
          </AtomsPill>
        </h2>

        <p role="presentation" class="o-listing-mobile-banner__address | body-sm">
          123 House, Somewhere Street
        </p>
      </div>

      <OrganismsListingButtons :property-id="4" enquire-url="#" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  price: string
}

defineProps<Props>()

</script>

<style lang="scss">
.o-listing-mobile-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  background: var(--background-100);
  border-top: 1px solid var(--border-color-200);
  padding: var(--size-12) 0;

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-12);
    margin: 0;
  }
}
</style>