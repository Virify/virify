<template>
  <div class="| container">
    <h1 class="| title-xl">Listing cards</h1>

    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium accusamus, quo temporibus omnis pariatur rem
      voluptate cum quam optio libero neque error illum fugiat distinctio veritatis iste sunt nesciunt debitis.</p>

    <div class="p-listing-test-grid">
      <MoleculesListingCard v-for="i in 8" class="p-listing-test-griditem" />
    </div>
  </div>
</template>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.p-listing-test-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  row-gap: var(--size-56);
  column-gap: var(--size-28);
  padding: var(--size-56);
}

.p-listing-test-griditem {
  flex: 1 0 260px;
}
</style>