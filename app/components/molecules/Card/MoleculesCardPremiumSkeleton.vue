<template>
  <div class="m-card-premium-skeleton__container">
    <div class="m-card-premium-skeleton">
      <div class="m-card-premium-skeleton__gallery">
        <div class="m-card-premium-skeleton__carousel | skeleton"></div>
      </div>

      <div class="m-card-premium-skeleton__content">
        <div class="m-card-premium-skeleton__spotlight | skeleton"></div>

        <div class="m-card-premium-skeleton__premium-content">
          <div class="m-card-premium-skeleton__content-grid">
            <div class="m-card-premium-skeleton__price | skeleton"></div>
            <div class="m-card-premium-skeleton__overview | skeleton"></div>
            <ul class="m-card-premium-skeleton__icons">
              <li class="m-card-premium-skeleton__icon | skeleton"></li>
              <li class="m-card-premium-skeleton__icon | skeleton"></li>
              <li class="m-card-premium-skeleton__icon | skeleton"></li>
            </ul>
            <div class="m-card-premium-skeleton__pills | skeleton"></div>
            <div class="m-card-premium-skeleton__description | skeleton"></div>
          </div>

          <ul class="m-card-premium-skeleton__premium-list">
            <li v-for="key of 20" :key class="m-card-premium-skeleton__premium-listitem | skeleton"></li>
          </ul>
        </div>

        <div class="m-card-premium-skeleton__footer">
          <div class="m-card-premium-skeleton__author | skeleton"></div>
          <div class="m-card-premium-skeleton__buttons">
            <div class="m-card-premium-skeleton__button | skeleton"></div>
            <div class="m-card-premium-skeleton__button | skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.m-card-premium-skeleton__container {
  container-type: inline-size;
}

.m-card-premium-skeleton {
  position: relative;
  border: 2px solid var(--background-300);
  border-radius: var(--border-radius-3xl);
  box-sizing: border-box;
  display: grid;
  align-items: stretch;
  gap: var(--size-8);
  overflow: hidden;

  @container (width > 950px) {
    grid-template-columns: 1.2fr minmax(20ch, 1fr);
  }

  &__gallery {
    display: flex;
    align-items: flex-start;
    width: 100%;
  }

  &__carousel {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
    border-radius: var(--border-radius-2xl);
  }

  &__content {
    display: flex;
    flex-direction: column;
    padding: var(--size-16);
    container-type: inline-size;
  }

  &__spotlight {
    margin: 0 auto var(--size-32);
    width: min(50%, 16ch);
    height: 2ch;
  }

  &__premium-content {
    display: grid;
    gap: var(--size-12);

    @container (width <=600px) {
      .m-card-premium-skeleton__premium-listitem:nth-child(n+7) {
        display: none;
      }
    }

    @container (width > 600px) {
      align-items: center;
      grid-template-columns: 1fr 1.1fr;
      column-gap: var(--size-40);
    }
  }

  &__content-grid {
    display: flex;
    flex-direction: column;
    gap: var(--size-10);
  }

  &__price {
    width: min(100%, 16ch);
    height: 2.3ch;
  }

  &__overview {
    width: min(100%, 22ch);
    height: 3.5ch;
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: var(--size-16);
    padding: 0;
    margin: var(--size-12) 0;
  }

  &__icon {
    width: 5ch;
    height: 2.5ch;
  }

  &__pills {
    width: min(100%, 16ch);
    height: 1.8ch;
  }

  &__description {
    width: 100%;
    height: 5ch;
  }

  &__premium-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);
    padding: 0;
    margin: 0 0 var(--size-20);
  }

  &__premium-listitem {
    width: calc(50% - var(--size-4));
    height: 1.4ch;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: var(--size-10);
    margin-top: auto;
  }

  &__author {
    width: 100%;
    height: 2.8ch;
  }

  &__buttons {
    display: flex;
    gap: var(--size-10);
  }

  &__button {
    height: 3.2ch;
    flex-grow: 1;
  }
}
</style>
