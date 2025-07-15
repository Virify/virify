<template>
  <div class="o-listing-overview">
    <h2 v-if="price" class="o-listing-overview__title | title-lg lineheight-xs">
      <AtomsPill class="| body-2xs">
        Offers in excess of
      </AtomsPill>

      {{ price }}
    </h2>


    <p role="presentation" class="o-listing-overview__address | body-sm">
      {{ address }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  price?: string
  address?: string
}

const props = defineProps<Props>()
console.log("OrganismsListingOverview loaded with props:", props.address);
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-listing-overview {
  text-align: center;
  margin-top: 0;

  @include mq.notebook {
    text-align: left;
  }

  &__title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--size-8);

    @include mq.notebook {
      align-items: flex-start;
      justify-content: flex-start;
    }
  }
  &__address {
    color: var(--secondary-400);
    margin: 0;
    font-weight: 500;
    text-align: center;

    @include mq.notebook {
      text-align: left;
    }
  }
}
</style>