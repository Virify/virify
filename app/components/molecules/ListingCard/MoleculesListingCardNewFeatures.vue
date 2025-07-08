<template>
  <div class="m-listing-card-features">
    <div class="m-listing-card-feature">
      <AtomsIcon name="bed" icon="property/bedrooms" />
      <span class="body-sm">1</span>
    </div>
    <div class="m-listing-card-feature">
      <AtomsIcon name="bath" icon="property/bathrooms" />
      <span class="body-sm">2</span>
    </div>
    <div class="m-listing-card-feature">
      <AtomsIcon name="ruler" icon="property/receptions" />
      <span class="body-sm">3</span>
    </div>
  </div>
</template>

<style lang="scss">
.m-listing-card-features {
  display: flex;
  gap: var(--size-8);
  margin-bottom: var(--size-8);
}

.m-listing-card-feature {
  align-items: center;
  display: flex;
  font-weight: var(--font-semibold);
  font-size: var(--font-2xl);
  gap: var(--size-1);
  padding: var(--size-4);

  & span {
    margin-left: var(--size-4);
  }
}
</style>
