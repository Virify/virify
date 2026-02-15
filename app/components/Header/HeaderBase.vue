<template>
  <div class="header-base" :class="{
    'header-base--shadow': hasShadow
  }">
    <header class="header-base__inner | container">
      <nuxt-link to="/" class="header-base__home-link">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="/img/header/logo-dark.svg" />
          <img src="/img/header/logo-light.svg" alt="Virify logo" width="113" height="32" class="header-base__logo" />
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

/**
 *  Add subtle shadow to menu when user has scrolled
 */
const hasShadow = shallowRef(false)

function toggleShadow() {
  hasShadow.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', toggleShadow, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', toggleShadow)
})

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.header-base {
  position: sticky;
  top: 0;
  background: var(--background-100);
  padding: var(--size-8) 0;
  z-index: 3;
  transition: box-shadow var(--animation-subtle) var(--ease-in-out);

  @include mq.tablet {
    padding: var(--size-12) 0;

    @media (min-height: 940px) {
      padding: var(--size-20) 0;
    }
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-36);
  }

  &__home-link {
    display: block;
    margin-right: auto;

    @include mq.desktop {
      margin: 0;
    }
  }

  &__logo {
    width: auto;
    height: var(--size-28);

    @include mq.tablet {
      height: var(--size-32);
    }
  }

  &--shadow {
    box-shadow: 0 30px 60px -20px light-dark(rgba(#000, 0.07), rgba(#000, 0.5));
  }
}
</style>