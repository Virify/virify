<template>
  <div class="m-card-basic-skeleton__container">
    <div class="m-card-basic-skeleton">
      <div class="m-card-basic-skeleton__gallery | skeleton"></div>

      <div class="m-card-basic-skeleton__content">
        <div class="m-card-basic-skeleton__content-grid">
          <div class="m-card-basic-skeleton__price | skeleton"></div>
          <div class="m-card-basic-skeleton__overview | skeleton"></div>
          <ul class="m-card-basic-skeleton__icons">
            <li class="m-card-basic-skeleton__icon | skeleton"></li>
            <li class="m-card-basic-skeleton__icon | skeleton"></li>
            <li class="m-card-basic-skeleton__icon | skeleton"></li>
          </ul>
          <div class="m-card-basic-skeleton__pills | skeleton"></div>
        </div>

        <div class="m-card-basic-skeleton__footer">
          <div class="m-card-basic-skeleton__author | skeleton"></div>
          <div class="m-card-basic-skeleton__buttons">
            <div class="m-card-basic-skeleton__button | skeleton"></div>
            <div class="m-card-basic-skeleton__button | skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.m-card-basic-skeleton__container {
  container-type: inline-size;
}

.m-card-basic-skeleton {
  position: relative;
  border: 2px solid var(--background-300);
  border-radius: var(--border-radius-3xl);
  box-sizing: border-box;
  display: grid;
  align-items: stretch;
  gap: var(--size-8);
  overflow: hidden;

  @container (width > 750px) {
    grid-template-columns: 1.2fr minmax(20ch, 1fr);
  }

  &__gallery {
    width: 100%;
    height: auto;
    aspect-ratio: 4/3;
    border-radius: var(--border-radius-2xl);
  }

  &__content {
    display: flex;
    flex-direction: column;
    padding: var(--size-16);
    container-type: inline-size;
  }

  &__content-grid {
    display: flex;
    flex-direction: column;
    gap: var(--size-10);
    margin: 0 0 var(--size-20);

    @container (width > 420px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
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
  }

  &__icon {
    width: 5ch;
    height: 2.5ch;
  }

  &__pills {
    width: min(100%, 16ch);
    height: 1.8ch;
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
