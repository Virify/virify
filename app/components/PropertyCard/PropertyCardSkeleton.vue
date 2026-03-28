<template>
  <div class="property-card-skeleton">
    <div class="property-card-skeleton__image | v-skeleton"></div>

    <div class="property-card-skeleton__content">
      <div class="property-card-skeleton__price-type | v-skeleton"></div>
      <div class="property-card-skeleton__price | v-skeleton"></div>
      <div class="property-card-skeleton__address-1 | v-skeleton"></div>
      <div class="property-card-skeleton__address-2 | v-skeleton"></div>
      <div class="property-card-skeleton__pills">
        <div class="property-card-skeleton__pill | v-skeleton"></div>
        <div class="property-card-skeleton__pill | v-skeleton"></div>
      </div>
      <div class="property-card-skeleton__icons">
        <div class="property-card-skeleton__icon">
          <div class="property-card-skeleton__icon-sprite | v-skeleton"></div>
          <div class="property-card-skeleton__icon-name | v-skeleton"></div>
        </div>
        <div class="property-card-skeleton__icon">
          <div class="property-card-skeleton__icon-sprite | v-skeleton"></div>
          <div class="property-card-skeleton__icon-name | v-skeleton"></div>
        </div>
        <div class="property-card-skeleton__icon">
          <div class="property-card-skeleton__icon-sprite | v-skeleton"></div>
          <div class="property-card-skeleton__icon-name | v-skeleton"></div>
        </div>
      </div>
      <div class="property-card-skeleton__footer">
        <div class="property-card-skeleton__button | v-skeleton"></div>
        <div class="property-card-skeleton__button | v-skeleton"></div>
        <div class="property-card-skeleton__additional | v-skeleton"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  inheritAttrs: false
})

</script>

<style lang="scss">
@mixin small-card {
  @container card (width < 275px) {
    @content;
  }
}

.property-card-skeleton {
  overflow: hidden;
  container-name: card;
  container-type: inline-size;

  &__image {
    display: block;
    width: 100%;
    aspect-ratio: 4/3;
    border-radius: var(--border-radius-2xl);
  }

  &__content {
    padding: var(--size-18);
  }

  &__price-type {
    display: block;
    width: 8ch;
    height: var(--size-24);
    border-radius: var(--border-radius-md);
  }

  &__price {
    display: block;
    width: min(100%, 18ch);
    height: var(--size-32);
    border-radius: var(--border-radius-md);
    margin: var(--size-4) 0 0;
  }

  &__address-1,
  &__address-2 {
    display: block;
    width: 100%;
    height: var(--size-16);
    border-radius: var(--border-radius-md);
  }

  &__address-1 {
    margin: var(--size-12) 0 0;
  }

  &__address-2 {
    margin: var(--size-4) 0 0;
  }

  &__pills {
    display: flex;
    gap: var(--size-8);
    margin: var(--size-12) 0 0;
  }

  &__pill {
    width: 6ch;
    height: var(--size-20);
    border-radius: var(--border-radius-md);
  }

  &__icons {
    display: flex;
    gap: var(--size-16);
    margin: var(--size-18) 0 var(--size-20);
    overflow: hidden;
  }

  &__icon {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-4);
  }

  &__icon-sprite {
    width: 3ch;
    height: 2.2ch;
    border-radius: var(--border-radius-md);
    flex-shrink: 0;
  }

  &__icon-name {
    width: 5ch;
    height: var(--size-14);
    border-radius: var(--border-radius-sm);
    flex-shrink: 0;
  }

  &__footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-8);
  }

  &__button {
    height: var(--size-40);
    border-radius: var(--border-radius-ui);
  }

  &__additional {
    height: var(--size-56);
    grid-column: span 2;
    border-radius: var(--border-radius-ui);

    @include small-card {
      height: var(--size-96);
    }
  }
}
</style>