<template>
  <div class="header-buttons-guest">
    <nuxt-link to="/login" @click.capture="showLogin" class="header-buttons-guest__login-button | button button-header">
      Log in
    </nuxt-link>

    <nuxt-link to="/signup" @click.capture="showSignup" class="| button button-header button-header--cta">
      <span class="header-buttons-guest__text--mobile">Join</span>
      <span class="header-buttons-guest__text--desktop">Create Account</span>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogSignup, ViewsDialogLogin } from '#components'

/**
 *  a11y
 */
const { isMetaKey } = useEventKey()

/**
 *  Dialogs
 *
 *  @TODO - we could combine the below functions, but the abstraction
 *          is probably not worth the effort
 */
const { showDialog } = useDialog()

function showLogin(e: PointerEvent) {
  // If meta key pressed, allow usual functionality
  if (isMetaKey(e)) return

  // Else block navigation
  e.preventDefault()

  // Show dialog
  showDialog({
    component: ViewsDialogLogin,
  });
}

function showSignup(e: PointerEvent) {
  // If meta key pressed, allow usual functionality
  if (isMetaKey(e)) return

  // Else block navigation
  e.preventDefault()

  // Show dialog
  showDialog({
    component: ViewsDialogSignup,
  });
}


</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.header-buttons-guest {
  display: flex;
  align-items: center;
  gap: var(--size-8);

  &__text--mobile {
    display: none;
  }

  &__text--desktop {
    display: unset;
  }

  @include mq.mobile-and-small-tablet {
    gap: var(--size-4);

    &__text--mobile {
      display: unset;
    }

    &__text--desktop {
      display: none;
    }

    &__login-button {
      background: transparent;
      color: currentColor;

      &:hover {
        background: transparent;
        color: currentColor;
      }
    }
  }
}
</style>