<template>
  <PopoverRoot>
    <PopoverTrigger class="header-actions-logged-in__toggle | body-md">
      Account

      <span role="img" class="header-actions-logged-in__profile-image">
        <AtomsIcon icon="profile" />
      </span>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent align="end" :align-offset="-16" :side-offset="8"
        class="header-actions-logged-in__popover | gradient-box">
        <nuxt-link v-for="{ title, url } of accountLinks" :key="title" :to="url"
          class="header-actions-logged-in__button">
          {{ title }}
        </nuxt-link>

        <nuxt-link to="dashboard?notifications=true" class="header-actions-logged-in__button">
          Notifications

          <span class="header-actions-logged-in__notifications | body-2xs" :class="{
            'header-actions-logged-in__notifications--active': notificationsTotal
          }">
            {{ notificationsTotal }}
          </span>
        </nuxt-link>

        <label class="header-actions-logged-in__button">
          Dark mode

          <HeaderDarkModeToggle />
        </label>

        <button type="button" class="header-actions-logged-in__button header-actions-logged-in__button--logout"
          @click.prevent="logOut">
          Log out
          <AtomsIcon icon="account/logout" />
        </button>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup>
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from 'reka-ui'

/**
 *  Account navigation
 */
const accountLinks = [
  {
    title: 'Dashboard',
    url: '/dashboard'
  },
  {
    title: 'Security',
    url: '/dashboard/security'
  }
]

/**
 *  Show notifications
 */
const { notificationCounts, fetchNotificationCounts } = useNotifications()

onMounted(() => {
  fetchNotificationCounts();
})

const notificationsTotal = computed(() => {
  const { total = 0 } = asObject(notificationCounts.value)

  return total
})

/**
 *  Log user out
 */
const { clear } = useUserSession()

async function logOut() {
  await clear()

  const { path } = useRoute()

  if (path.startsWith('/account')) {
    navigateTo('/')
  }
}

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.header-actions-logged-in {

  &__toggle {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    font-weight: var(--font-bold);
    padding: 0;
    margin: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    transition: color var(--animation-fast);
    font-size: var(--font-md);

    @include mq.tablet {
      gap: var(--size-14);
    }

    @media (hover: hover) {
      &:hover {
        background: transparent;
        color: var(--secondary-400);
      }
    }
  }

  &__profile-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-36);
    height: var(--size-36);
    border-radius: var(--border-radius-pill);
    background: light-dark(var(--monochrome-700), var(--monochrome-400));
    object-fit: contain;
    color: light-dark(var(--monochrome-100), var(--monochrome-900));

    .a-icon {
      display: block;
      width: var(--size-24);
      height: var(--size-24);
    }
  }

  &__popover {
    padding: var(--size-20) var(--size-16) var(--size-16);
    background: var(--background-200);
    width: min(calc(100vw - var(--size-32)), 24ch);
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--size-8) var(--size-20);
    background: transparent;
    color: currentColor;
    text-decoration: none;
    font-weight: var(--font-bold);
    border-radius: var(--border-radius-xl);
    transition: background-color var(--animation-fast);
    cursor: pointer;
    font-size: var(--font-lg);
    box-sizing: border-box;
    width: 100%;

    @include mq.desktop {
      font-size: var(--font-md);
    }

    @media (hover: hover) {
      &:hover {
        background: var(--background-300);
        color: currentColor;
      }
    }

    &--logout {
      margin-top: var(--size-36);
      padding: var(--size-14) var(--size-20);
      background: var(--error-background);
      color: var(--error-foreground);

      &:hover {
        background: var(--error-background-hover);
        color: var(--error-foreground);
      }
    }

    .a-icon {
      display: block;
      width: var(--size-24);
      height: var(--size-24);
    }
  }

  &__notifications {
    display: block;
    border-radius: var(--border-radius-pill);
    padding: var(--size-4) var(--size-8);
    background: light-dark(var(--monochrome-600), var(--monochrome-400));
    color: var(--monochrome-900);

    &--active {
      background: var(--error);
    }
  }
}
</style>