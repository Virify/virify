<template>
  <div class="| container">
    <h1 class="| title-xl">Listing cards</h1>

    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium accusamus, quo temporibus omnis pariatur rem
      voluptate cum quam optio libero neque error illum fugiat distinctio veritatis iste sunt nesciunt debitis.</p>

    <div class="p-listing-test-grid">
      <MoleculesListingCard v-for="i in 8" />
    </div>

    <AtomsIcon icon="cards/verified" />
    <AtomsIcon icon="cards/beds" />
    <AtomsIcon icon="cards/favourite" />
    <AtomsIcon icon="cards/property-type" />
  </div>
</template>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.p-listing-test-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: var(--size-56);
  column-gap: var(--size-28);
  padding: var(--size-56);

  @include mq.tablet {
    grid-template-columns: repeat(3, 1fr);
  }

  @include mq.desktop {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>