<template>
  <div class="o-header | container">
    <nuxt-link to="/" alt="Back to homepage" class="o-header-homelink">
      <AtomsIcon title="Virify Ltd" icon="logo/horizontal-colour" width="222" height="67" class="o-header-logo" />
    </nuxt-link>

    <OrganismsSiteNavigation />
  </div>
</template>

<style>
.o-header {
  padding: var(--size-16) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.o-header-homelink {
  display: block;
  width: min(60%, 120px);
}

.o-header-logo {
  display: block;
  width: 100%;
  height: auto;
}
</style>