<template>
  <section class="o-listing-sidebar-agent | body-sm">
    <div class="o-listing-sidebar-agent__logo"></div>

    <div role="presentation" class="| flow flow-3xs">
      <h3 class="o-listing-sidebar-agent__name | title-xs">Agent Name</h3>
      <p class="| body-xs">123 Agent Street, SM1 TWN</p>
      <address>Email, Phone Number</address>
    </div>
  </section>
</template>

<style lang="scss">
.o-listing-sidebar-agent {
  background: var(--background-300);
  color: var(--foreground-300);
  border-radius: var(--border-radius-2xl);
  padding: var(--size-16);
  display: grid;
  grid-template-columns: 5em auto;
  gap: var(--size-16);
  align-items: flex-start;

  &__logo {
    aspect-ratio: 1;
    border-radius: var(--border-radius-lg);
    background: var(--monochrome-400);
  }

  &__name {
    margin: 0;
  }
}
</style>