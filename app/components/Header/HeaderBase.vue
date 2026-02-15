<template>
  <div class="header-base">
    <header class="header-base__inner | container">
      <nuxt-link to="/">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="/img/header/logo-dark.svg" />
          <img src="/img/header/logo-light.svg" alt="Virify logo" width="113" height="32" />
        </picture>
      </nuxt-link>

      <LazyHeaderDesktopNav hydrate-on-visible :menu="mainMenu" />

      <template v-if="isWaitingList">
        <LazyHeaderButtonsWaitingList />
      </template>

      <template v-else>
        <LazyHeaderButtonsGuest />
      </template>
    </header>
  </div>
</template>

<script setup lang="ts">
const { mainMenu } = await useMainNavigation()

/**
 *  Check whether to skip the wait list - this doesn't need to be
 *  reactive so we don't need to use computed functions
 */
const checkWaitingList = () => {
  const { isWaitingList } = useRuntimeConfig().public
  const { query } = useRoute()

  return isWaitingList && !query.skipWaitlist
}

const isWaitingList = checkWaitingList()

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.header-base {
  position: sticky;
  top: 0;
  background: var(--background-100);
  padding: var(--size-8) 0;
  z-index: 3;

  @include mq.tablet {
    padding: var(--size-16) 0;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-36);
  }
}
</style>