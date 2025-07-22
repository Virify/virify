<template>
  <div class="m-card-slots-carousel">
    <div class="m-card-slots-carousel__slide">
      <p>Carousel</p>
    </div>

    <div class="m-card-slots-carousel__slide m-card-slots-carousel__slide--second">
      <p>Carousel</p>
    </div>
  </div>
</template>

<style lang="scss">
.m-card-slots-carousel {
  display: flex;
  gap: var(--size-4);
  flex-grow: 1;

  &__slide {
    background: var(--monochrome-300);
    border-radius: var(--border-radius-xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--size-16);
    box-sizing: border-box;
    aspect-ratio: 4/3;
    color: var(--monochrome-900);
    flex-grow: 1;

    &--second {
      display: none;

      @container (width > 450px) {
        display: flex;
      }
    }
  }
}
</style>