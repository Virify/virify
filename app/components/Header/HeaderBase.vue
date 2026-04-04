<template>
  <div id="__header" class="header-base" ref="$header">
    <header class="header-base__inner | container">
      <LazyHeaderMobileRoot class="header-base__nav header-base__nav--mobile" hydrate-on-visible :menu="mainMenu" />

      <nuxt-link to="/" class="header-base__home-link">
        <svg width="113" height="32" class="header-base__logo">
          <title>Virify logo</title>
          <use href="/img/logo.svg#default"></use>
        </svg>
      </nuxt-link>

      <LazyHeaderDesktopRoot class="header-base__nav header-base__nav--desktop" hydrate-on-visible :menu="mainMenu" />

      <template v-if="isWaitingListMode">
        <LazyHeaderActionsWaitingList />
      </template>

      <template v-else>
        <LazyHeaderActionsLoggedIn v-if="loggedIn" />
        <LazyHeaderActionsGuest v-else />
      </template>
    </header>
  </div>

  <span role="presentation" class="header-base__spacer"></span>
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
const { isWaitingListMode } = useWaitingListMode();

/**
 *  Add subtle shadow to menu when user has scrolled
 */
const $header = useTemplateRef('$header')

function toggleShadow() {
  if (!isElement($header.value)) return

  // @TODO
  // This should be handled via Vue reactivity, e.g. having:
  //   hasShadow.value = window.scrollY > 0
  // And on the component,
  //   :class={ 'header-base--shadow': hasShadow }
  // But there is an unknown bug, so doing it this way for now
  $header.value.classList.toggle('header-base--shadow', window.scrollY > 0)
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

:root {
  --header-height: 60px;

  @include mq.tablet {
    --header-height: 64px;
  }

  @include mq.notebook {
    --header-height: 68px;

    @media (min-height: 940px) {
      --header-height: 78px;
    }
  }
}

.header-base {
  position: fixed;
  width: 100%;
  top: 0;
  display: flex;
  align-items: center;
  background: var(--background-200);
  height: var(--header-height);
  padding: 0;
  z-index: 9;
  transition: box-shadow var(--animation-subtle) var(--ease-in-out);

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

  &__spacer {
    display: block;
    height: var(--header-height);
  }
}
</style>