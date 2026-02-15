<template>
  <div class="header-base">
    <header class="header-base__inner | container">
      <nuxt-link to="/">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="/img/header/logo-dark.svg" />
          <img src="/img/header/logo-light.svg" alt="Virify logo" width="113" height="32" />
        </picture>
      </nuxt-link>

      <HeaderDesktopNav :menu="mainMenu" />

      <div>
        <button class="| button button-ghost button-sm">Log in</button>
        <button class="| button button-secondary button-sm">Create Account</button>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
const { mainMenu } = await useMainNavigation()

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.header-base {
  position: sticky;
  top: 0;
  background: var(--background-200);
  padding: var(--size-8) 0;
  z-index: 2;

  @include mq.tablet {
    padding: var(--size-16) 0;
  }

  @include mq.notebook {
    padding: var(--size-24) 0;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-36);
  }
}
</style>