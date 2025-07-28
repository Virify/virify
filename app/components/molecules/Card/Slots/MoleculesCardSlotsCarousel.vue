<template>
  <MoleculesNewCarousel :slides v-slot="{ slide }" class="m-card-slots-carousel">
    <div class="m-card-slots-carousel__slide">
      {{ slide }}
    </div>
  </MoleculesNewCarousel>
</template>

<script setup>
const slides = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five'
]
</script>

<style lang="scss">
.m-card-slots-carousel {
  width: 100%;
  flex-grow: 1;
  border-radius: calc(var(--border-radius-3xl) - 2px);
  overflow: hidden;

  &__slide {
    background: var(--monochrome-300);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--size-16);
    box-sizing: border-box;
    aspect-ratio: 4/3;
    color: var(--monochrome-900);
    flex-grow: 1;
  }
}
</style>