<template>
  <div class="o-header | container pointer-none">
    <nuxt-link to="/" alt="Back to homepage" class="o-header-homelink | pointer">
      <AtomsIcon title="Virify Ltd" icon="logo/horizontal-colour" width="222" height="67" class="o-header-logo" />
    </nuxt-link>

    <OrganismsSiteNavigation class="| pointer" />
  </div>
</template>

<style>
.o-header {
  position: sticky;
  top: 0;
  padding: var(--size-16) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
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