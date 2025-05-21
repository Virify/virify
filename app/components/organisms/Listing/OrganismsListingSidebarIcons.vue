<template>
  <ul class="o-listing-sidebar-icons | body-sm">
    <li class="o-listing-sidebar-icons__row o-listing-sidebar-icons__row--full">
      <AtomsIcon icon="listings/property-type" aria-hidden class="o-listing-sidebar-icons__icon" />
      House / Student accommodation
    </li>
    <li class="o-listing-sidebar-icons__row">
      <AtomsIcon icon="listings/beds" aria-hidden class="o-listing-sidebar-icons__icon" />
      2 beds
    </li>
    <li class="o-listing-sidebar-icons__row">
      <AtomsIcon icon="listings/bathrooms" aria-hidden class="o-listing-sidebar-icons__icon" />
      3 bathrooms
    </li>
    <li class="o-listing-sidebar-icons__row">
      <AtomsIcon icon="listings/contract" aria-hidden class="o-listing-sidebar-icons__icon" />
      Leasehold
    </li>
  </ul>
</template>

<style lang="scss">
.o-listing-sidebar-icons {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  border-radius: var(--border-radius-2xl);
  margin-inline: 0;
  gap: var(--size-6);

  &__row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--size-6);
    white-space: nowrap;
    flex: 1 1 auto;

    &--full {
      width: 100%;
      flex-grow: 1;
    }
  }

  &__icon {
    display: block;
    width: var(--size-20);
    height: var(--size-20);
  }
}
</style>