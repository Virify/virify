<template>
  <div class="header-buttons-guest">
    <nuxt-link to="/login" @click.capture="showLogin" class="| button button-header">
      Log in
    </nuxt-link>

    <nuxt-link to="/signup" @click.capture="showSignup" class="| button button-header button-header--cta">
      Create Account
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
.header-buttons-guest {
  display: flex;
  align-items: center;
  gap: var(--size-8);
}
</style>