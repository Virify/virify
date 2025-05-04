<template>
  <nav class="o-site-navigation">
    <ul class="o-site-navigation-list">
      <template v-if="!loggedIn">
        <li>
          <button @click.prevent="openLogin" class="| bo-site-navigation-link | body-sm font-bold">Log in</button>
        </li>
        <li>
          <button @click.prevent="openForgotPassword" class="o-site-navigation-link | button button-monochrome button-sm">Signup</button>
        </li>
      </template>

      <li v-else>
        <MoleculesAccountPopover :options="accountOptions" />
      </li>
    </ul>
  </nav>
</template>

<script setup>
const { loggedIn, clear } = useUserSession()
const { showDialog } = useDialog()
import { ViewsDialogSignup, ViewsDialogLogin } from '#components';

// logout function
async function logout() {
  await clear()
}

function openLogin() {
  showDialog({
    component: ViewsDialogLogin,
  });
}

function openForgotPassword() {
  showDialog({
    component: ViewsDialogSignup,
  });
}


const accountOptions = [
  { to: '/account', label: 'My Account' },
  { to: '/logout', label: 'Log out' }
]
</script>

<style lang="scss">
@use "#styles/_utils/media.scss" as mq;

.o-site-navigation-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: var(--size-16);

  @include mq.desktop {
    gap: var(--size-20);
  }
}

.o-site-navigation-link {
  white-space: nowrap;
  text-decoration: none;
}
</style>