<template>
  <div class="o-hero-home | container">
    <div class="o-hero-home-content">
      <h1 class="o-hero-home-title | title-2xl lineheight-sm">Property search on another level</h1>

      <OrganismsSearchForm />
    </div>
  </div>
</template>

<style>
.o-hero-home {
  background:
    url('/img/logo-background.svg') no-repeat top right, linear-gradient(70deg, var(--monochrome-100), var(--primary-200));
  background-size: auto 120%, cover;
  color: var(--monochrome-900);
  border-radius: var(--border-radius-3xl);
  padding: var(--size-72) var(--size-32);
  min-height: max(400px, 50vh);
  margin-bottom: var(--size-32);
  display: flex;
  align-items: center;
  justify-content: center;
}

.o-hero-home-content {
  text-align: center;
}

.o-hero-home-title {
  max-width: 15ch;
  margin: 0 auto var(--size-32);
}
</style>