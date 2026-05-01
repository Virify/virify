<template>
  <PopoverRoot v-model:open="popoverOpen">
    <PopoverTrigger class="header-actions-logged-in__toggle | body-md">
      Account

      <div role="presentation" class="header-actions-logged-in__profile">
        <NuxtImg v-if="userImage" :src="userImage" class="header-actions-logged-in__profile-image" />
        <AvatarInitials v-else :name="userName" class="header-actions-logged-in__profile-image" />

        <span v-if="notificationsTotal > 0" class="header-actions-logged-in__unread-badge"
          aria-label="Unread notifications"></span>
      </div>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        align="end"
        :align-offset="-16"
        :side-offset="8"
        class="header-actions-logged-in__popover | gradient-box"
        :class="{ 'header-actions-logged-in__popover--wide': activePanel === 'notifications' }"
      >
        <!-- Main nav panel -->
        <template v-if="activePanel === 'main'">
          <nuxt-link v-for="{ title, url } of accountLinks" :key="title" :to="url"
            class="header-actions-logged-in__button">
            {{ title }}
          </nuxt-link>

          <button type="button" class="header-actions-logged-in__button" @click="openNotifications">
            Notifications

            <span class="header-actions-logged-in__notifications | body-2xs" :class="{
              'header-actions-logged-in__notifications--active': notificationsTotal
            }">
              {{ notificationsTotal }}
            </span>
          </button>

          <label class="header-actions-logged-in__button">
            Dark mode

            <HeaderDarkModeToggle />
          </label>

          <button type="button" class="header-actions-logged-in__button header-actions-logged-in__button--logout"
            @click.prevent="logOut">
            Log out
            <AtomsIcon icon="account/logout" />
          </button>
        </template>

        <!-- Notifications panel -->
        <HeaderActionsNotificationsPanel
          v-else-if="activePanel === 'notifications'"
          @back="activePanel = 'main'"
          @select="popoverOpen = false"
        />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from 'reka-ui'

/**
 *  Panel switching
 */
const popoverOpen = ref(false)
const activePanel = ref<'main' | 'notifications'>('main')

watch(popoverOpen, (open) => {
  if (!open) activePanel.value = 'main'
})

/**
 *  Show notifications
 */
const { notificationCounts, fetchNotificationCounts, fetchNotifications } = useNotifications()

onMounted(() => {
  fetchNotificationCounts();
})

const notificationsTotal = computed<number>(() => {
  const { total = 0 } = asObject(notificationCounts.value) as { total?: number }

  return total
})

async function openNotifications() {
  activePanel.value = 'notifications'
  await fetchNotifications({ force: true, page: 1 })
}

/**
 *  User info and logout
 */
const { clear, user } = useUserSession()

const userImage = computed(() => {
  return user.value?.avatar
})

const userName = computed(() => {
  const { firstName, lastName, username } = asObject(user.value)

  // Get full name
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()

  // Return either the full name or, if no name given, the username
  return fullName ?? username
})

/**
 *  Account navigation
 */
const accountLinks = computed(() => {
  const links: { title: string; url: string }[] = [
    { title: 'Dashboard', url: '/dashboard' },
    { title: 'Settings', url: '/dashboard/profile' },
  ]
  if (isAdmin(user.value as Parameters<typeof isAdmin>[0])) {
    links.splice(1, 0, { title: 'Admin Dashboard', url: '/admin' })
  }
  return links
})

async function logOut() {
  await clear()

  // Notify other open tabs to also log out
  try { new BroadcastChannel('virify:auth').postMessage({ type: 'logout' }) } catch {}

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
        color: var(--primary-400);
      }
    }
  }

  &__profile {
    position: relative;
  }

  &__profile-image {
    width: var(--size-36);
    height: var(--size-36);
    border-radius: var(--border-radius-pill);
    background: light-dark(var(--blue-400), var(--blue-100));
    color: var(--monochrome-900);
    font-size: var(--font-sm);
    object-fit: contain;
  }

  &__unread-badge {
    position: absolute;
    top: -3px;
    right: -3px;
    width: 13px;
    height: 13px;
    border-radius: var(--border-radius-pill);
    background: var(--error);
    border: 2px solid var(--background-200);
    pointer-events: none;
    box-sizing: border-box;
  }

  &__popover {
    padding: var(--size-20) var(--size-16) var(--size-16);
    background: var(--background-100);
    width: min(calc(100vw - var(--size-32)), 24ch);
    transition: width var(--animation-fast);
    transform-origin: 100% 0;

    @media (prefers-reduced-motion: no-preference) {
      animation: fadeInDropdown var(--animation-fast) var(--ease-in-out);
    }

    &--wide {
      width: min(calc(100vw - var(--size-32)), 360px);
    }
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
      background: var(--error-background-100);
      color: var(--error-foreground);

      &:hover {
        background: var(--error-background-200);
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

@keyframes fadeInDropdown {
  from {
    opacity: 0;
    scale: 0.9;
  }
}
</style>