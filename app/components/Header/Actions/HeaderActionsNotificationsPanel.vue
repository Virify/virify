<template>
  <div class="nav-notifications">
    <!-- Header row -->
    <div class="nav-notifications__header">
      <button type="button" class="nav-notifications__back" @click="emit('back')">
        <AtomsIcon icon="chevron-left" :size="20" />
        Back
      </button>
      <button
        v-if="unreadCount > 0"
        type="button"
        class="nav-notifications__mark-all"
        @click="markAsRead({ all: true })"
      >
        Mark all read
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="notificationsLoading && !notifications.length" class="nav-notifications__skeleton">
      <div v-for="i in 3" :key="i" class="nav-notifications__skeleton-item">
        <SkeletonLoader class="nav-notifications__skeleton-title" />
        <SkeletonLoader class="nav-notifications__skeleton-message" />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!notificationsLoading && !displayNotifications.length" class="nav-notifications__empty">
      <p class="body-sm">You're all caught up</p>
    </div>

    <!-- Notification list -->
    <div v-else class="nav-notifications__list">
      <div
        v-for="notification in displayNotifications"
        :key="notification.id"
        role="button"
        tabindex="0"
        class="nav-notifications__item"
        :class="{ 'nav-notifications__item--unread': !notification.isRead }"
        @click="handleSelect(notification)"
        @keydown.enter.space.prevent="handleSelect(notification)"
      >
        <span class="nav-notifications__unread-dot" aria-hidden="true" />

        <div class="nav-notifications__item-content">
          <p class="nav-notifications__item-title">{{ notification.title }}</p>
          <p class="nav-notifications__item-message">{{ notification.message }}</p>
          <div class="nav-notifications__item-meta">
            <UAvatar
              v-if="notification.senderAvatar || notification.senderUsername"
              :src="notification.senderAvatar || undefined"
              :alt="notification.senderUsername || 'User'"
              size="2xs"
              class="nav-notifications__item-avatar"
            />
            <span v-if="notification.senderUsername" class="nav-notifications__item-sender">{{ notification.senderUsername }}</span>
            <span class="nav-notifications__item-time">{{ formatMessageTimestamp(notification.createdAt) }}</span>
          </div>
        </div>

        <button
          type="button"
          class="nav-notifications__dismiss"
          :aria-label="`Dismiss: ${notification.title}`"
          @click.stop="handleDismiss(notification.id)"
        >
          <AtomsIcon icon="cross" :size="16" />
        </button>
      </div>

      <!-- Infinite scroll sentinel -->
      <div ref="sentinel" class="nav-notifications__sentinel" />

      <!-- Load more spinner -->
      <div v-if="notificationsLoading && notifications.length" class="nav-notifications__loading">
        <span class="body-xs">Loading…</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const emit = defineEmits<{
  (e: 'back'): void
}>()

const {
  notifications,
  notificationsLoading,
  notificationHasMore,
  loadMoreNotifications,
  dismissNotification,
  markAsRead,
  unreadCount,
} = useNotifications()

const { openConversation } = useGlobalEnquiryModal()

/**
 * Only show unread, non-dismissed notifications in the nav panel.
 * Clicking a notification marks it as read → it drops out of this list automatically.
 */
const displayNotifications = computed(() =>
  notifications.value.filter(n => !n.isDismissed && !n.isRead)
)

async function handleSelect(notification: UserNotification) {
  if (!notification.isRead) {
    markAsRead({ notificationId: notification.id })
  }

  if (notification.conversationId) {
    await openConversation(notification.conversationId)
  } else if (notification.listingId) {
    navigateTo(`/listing/${notification.listingId}`)
  }
}

async function handleDismiss(notificationId: number) {
  await dismissNotification(notificationId)
}

/**
 * Infinite scroll
 */
const sentinel = ref<HTMLElement | null>(null)

const stopObserver = import.meta.client
  ? useIntersectionObserver(
      sentinel,
      ([entry]) => {
        if (entry?.isIntersecting && notificationHasMore.value && !notificationsLoading.value) {
          loadMoreNotifications()
        }
      },
      { threshold: 0.1 }
    ).stop
  : null

onBeforeUnmount(() => {
  stopObserver?.()
})
</script>

<style lang="scss">
.nav-notifications {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--size-8) var(--size-12);
    border-bottom: 1px solid var(--background-300);
    margin-bottom: var(--size-4);
  }

  &__back {
    display: flex;
    align-items: center;
    gap: var(--size-4);
    padding: var(--size-4) var(--size-8);
    margin-left: calc(var(--size-8) * -1);
    background: transparent;
    border: 0;
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    font-size: var(--font-sm);
    font-weight: var(--font-bold);
    color: currentColor;
    transition: background-color var(--animation-fast);

    @media (hover: hover) {
      &:hover {
        background: var(--background-300);
      }
    }
  }

  &__mark-all {
    padding: var(--size-4) var(--size-8);
    margin-right: calc(var(--size-8) * -1);
    background: transparent;
    border: 0;
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    font-size: var(--font-xs);
    font-weight: var(--font-bold);
    color: var(--primary-400);
    transition: opacity var(--animation-fast);

    @media (hover: hover) {
      &:hover {
        opacity: 0.7;
      }
    }
  }

  &__list {
    max-height: 360px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    margin: 0 calc(var(--size-16) * -1);
    padding: 0 var(--size-16);
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: var(--size-8);
    width: 100%;
    text-align: left;
    background: transparent;
    border: 0;
    border-radius: var(--border-radius-xl);
    padding: var(--size-8) var(--size-8);
    cursor: pointer;
    transition: background-color var(--animation-fast);
    color: currentColor;
    box-sizing: border-box;

    @media (hover: hover) {
      &:hover {
        background: var(--background-300);
      }
    }

    // Hide unread dot by default (for read items)
    .nav-notifications__unread-dot {
      opacity: 0;
    }

    &--unread {
      .nav-notifications__unread-dot {
        opacity: 1;
      }
    }
  }

  &__unread-dot {
    flex-shrink: 0;
    display: block;
    width: var(--size-8);
    height: var(--size-8);
    margin-top: var(--size-4);
    border-radius: var(--border-radius-pill);
    background: var(--primary-400);
    transition: opacity var(--animation-fast);
  }

  &__item-content {
    flex: 1;
    min-width: 0;
  }

  &__item-title {
    font-size: var(--font-sm);
    font-weight: var(--font-bold);
    margin: 0 0 var(--size-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item-message {
    font-size: var(--font-xs);
    margin: 0 0 var(--size-2);
    opacity: 0.7;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.3;
  }

  &__item-meta {
    display: flex;
    align-items: center;
    gap: var(--size-4);
    margin-top: var(--size-2);
  }

  &__item-avatar {
    flex-shrink: 0;
  }

  &__item-sender {
    font-size: var(--font-xs);
    font-weight: var(--font-bold);
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80px;
  }

  &__item-time {
    font-size: var(--font-xs);
    opacity: 0.5;
    white-space: nowrap;
    margin-left: auto;
  }

  &__dismiss {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--size-4);
    background: transparent;
    border: 0;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    color: currentColor;
    opacity: 0.4;
    transition: opacity var(--animation-fast), background-color var(--animation-fast);

    @media (hover: hover) {
      &:hover {
        opacity: 1;
        background: var(--background-400, var(--background-300));
      }
    }
  }

  &__empty {
    padding: var(--size-24) var(--size-8);
    text-align: center;
    opacity: 0.6;
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    padding: var(--size-8) 0;
  }

  &__skeleton-item {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    padding: var(--size-8);
  }

  &__skeleton-title {
    height: var(--size-16);
    width: 70%;
    border-radius: var(--border-radius-sm);
  }

  &__skeleton-message {
    height: var(--size-12);
    width: 90%;
    border-radius: var(--border-radius-sm);
  }

  &__sentinel {
    height: var(--size-4);
  }

  &__loading {
    padding: var(--size-8);
    text-align: center;
    opacity: 0.6;
  }
}
</style>
