<template>
  <PopoverRoot>
    <PopoverTrigger class="header-actions-logged-in__toggle | body-md">
      Account

      <span role="img" class="header-actions-logged-in__profile-image">
        <!-- img here -->
      </span>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent align="end" :align-offset="-16" :side-offset="8"
        class="header-actions-logged-in__popover | gradient-box">
        <a href="#account" class="header-actions-logged-in__button">
          Profile
        </a>

        <a href="#security" class="header-actions-logged-in__button">
          Security
        </a>

        <a href="#notifications" class="header-actions-logged-in__button">
          Notifications

          <span v-if="notificationCount" class="header-actions-logged-in__notifications | body-2xs">
            {{ notificationCount }}
          </span>
        </a>

        <label class="header-actions-logged-in__button">
          Dark mode

          <HeaderDarkModeToggle />
        </label>

        <a href="#" class="header-actions-logged-in__button header-actions-logged-in__button--logout">
          Log out
          <AtomsIcon icon="account/logout" />
        </a>
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

const notificationCount = shallowRef(12)

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.header-actions-logged-in {

  &__toggle {
    display: flex;
    align-items: center;
    gap: var(--size-14);
    font-weight: var(--font-bold);
    padding: 0;
    margin: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    transition: color var(--animation-fast);
    font-size: var(--font-lg);

    @include mq.desktop {
      font-size: var(--font-md);
    }

    @media (hover: hover) {
      &:hover {
        background: transparent;
        color: var(--secondary-400);
      }
    }
  }

  &__profile-image {
    display: block;
    width: var(--size-36);
    height: var(--size-36);
    border-radius: var(--border-radius-pill);
    background: var(--monochrome-500);
    object-fit: contain;
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
    background: var(--error);
    color: var(--monochrome-900);
  }
}
</style>