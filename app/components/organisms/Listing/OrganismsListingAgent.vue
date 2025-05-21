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
@use '#styles/_utils/functions' as fn;

.o-listing-sidebar-agent {
  --estate-agent-brand-background: #4e2489;
  --estate-agent-brand-foreground: #fff;

  background: var(--estate-agent-brand-background);
  color: var(--estate-agent-brand-foreground);
  border-radius: var(--border-radius-2xl);
  padding: var(--size-16);
  display: grid;
  grid-template-columns: 5em auto;
  gap: var(--size-16);
  align-items: flex-start;
  text-align: left;
  flex: 1 0 auto;

  &__logo {
    aspect-ratio: 1;
    border-radius: var(--border-radius-lg);
    background: #{ fn.faded-color(20%) };
  }

  &__name {
    margin: 0;
  }
}
</style>