<template>
  <div class="header-base" :class="{
    'header-base--shadow': hasShadow
  }">
    <header class="header-base__inner | container">
      <LazyHeaderMobileRoot class="header-base__nav header-base__nav--mobile" hydrate-on-visible :menu="mainMenu" />

      <nuxt-link to="/" class="header-base__home-link">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="/img/header/logo-dark.svg" />
          <img src="/img/header/logo-light.svg" alt="Virify logo" width="113" height="32" class="header-base__logo" />
        </picture>
      </nuxt-link>

      <LazyHeaderDesktopRoot class="header-base__nav header-base__nav--desktop" hydrate-on-visible :menu="mainMenu" />

      <template v-if="isWaitingList">
        <LazyHeaderActionsWaitingList />
      </template>

      <template v-else>
        <LazyHeaderActionsLoggedIn v-if="loggedIn" />
        <LazyHeaderActionsGuest v-else />
      </template>
    </header>
  </div>
</template>

<script setup lang="ts">
const { mainMenu } = await useMainNavigation()

/**
 *  Track logged in state
 */
const { loggedIn } = useUserSession();

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
  --header-height: 60px;

  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  background: var(--background-100);
  height: var(--header-height);
  padding: 0;
  z-index: 9;
  transition: box-shadow var(--animation-subtle) var(--ease-in-out);

  @include mq.tablet {
    --header-height: 64px;
  }

  @include mq.notebook {
    --header-height: 68px;

    @media (min-height: 940px) {
      --header-height: 78px;
    }
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-10);

    @include mq.desktop {
      gap: var(--size-36);
    }
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
    height: var(--size-32);

    @include mq.notebook {
      height: var(--size-36);
    }

    @include mq.superultrawide {
      height: var(--size-40);
    }
  }

  &--shadow {
    box-shadow: 0 30px 60px -20px light-dark(rgba(#000, 0.07), rgba(#000, 0.5));
  }

  &__nav {
    &--mobile {
      display: block;
    }

    &--desktop {
      display: none;
    }

    @include mq.desktop {
      &--mobile {
        display: none;
      }

      &--desktop {
        display: block;
      }
    }
  }
}
</style>