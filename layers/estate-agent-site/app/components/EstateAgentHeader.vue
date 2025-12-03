<template>
  <header class="estate-header">
    <div class="estate-header__inner">
      <NuxtLink to="/estate" class="estate-header__brand">
        Demo Estate Agent
      </NuxtLink>
      <nav class="estate-header__nav">
        <NuxtLink to="/estate/demo" class="estate-header__link">Home</NuxtLink>
        <NuxtLink to="/estate/demo/about" class="estate-header__link">About</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
.estate-header {
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;

  &__inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0.9rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  &__brand {
    font-weight: 600;
    text-decoration: none;
    color: #111827;
  }

  &__nav {
    display: flex;
    gap: 1rem;
  }

  &__link {
    font-size: 0.95rem;
    text-decoration: none;
    color: #4b5563;

    &.router-link-active {
      color: #111827;
      font-weight: 600;
    }
  }
}
</style>
