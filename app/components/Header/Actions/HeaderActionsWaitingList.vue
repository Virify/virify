<template>
  <div v-if="isAllowLogin" class="header-buttons-guest">
    <button @click.prevent="showLoginForm" class="header-buttons-guest__login-button | button button-header">
      Log in
    </button>

    <button @click.prevent="showSignupForm" class="| button button button-header button-header--cta">
      Join waiting list
    </button>
  </div>

  <button v-else @click.prevent="showSignupForm" class="| button button button-header button-header--cta">
    Join waiting list
  </button>
</template>

<script setup lang="ts">
import { ViewsDialogLogin, ViewsDialogWaitingList } from '#components'

const { showDialog } = useDialog()

/**
 *  Sign-up form
 */
function showSignupForm() {
  showDialog({
    component: ViewsDialogWaitingList
  })
}

/**
 *  Log in
 */
const { query } = useRoute()
const isAllowLogin = shallowRef(false)

onMounted(() => {
  const { showLogin } = asObject(query)

  isAllowLogin.value = showLogin === 'true'
})

function showLoginForm(e: PointerEvent) {
  e.preventDefault()

  showDialog({
    component: ViewsDialogLogin,
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