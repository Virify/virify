<template>
  <div>
    <NuxtLoadingIndicator />
    <OrganismsHeader />

    <div>
      <AtomsIcon width="40" height="40" title="Bathrooms icon" icon="property/bathrooms" />
    </div>

    <div class="page">
      <NuxtPage />
    </div>

    <OrganismsFooter />
  </div>
</template>

<style>
/*
 *  Temporary spacing just until proper page styling is implemented
 */
.page {
  margin: var(--size-32) auto;
}
</style>