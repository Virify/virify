<template>
  <nav class="o-site-navigation">
    <div class="o-site-navigation__wrapper">
      <ul class="o-site-navigation-list">
        <!-- Guides always shows first -->
        <li>
          <nuxt-link to="/guides" class="o-site-navigation-link | button button-monochrome button-sm">Guides</nuxt-link>
        </li>

        <!-- Not logged in: show Login and Signup -->
        <template v-if="!isLoggedIn">
          <li>
            <button @click.prevent="openLogin" class="o-site-navigation-link | body-sm button button-tertiary button-sm">Login</button>
          </li>
          <li>
            <button @click.prevent="openSignup" class="o-site-navigation-link | button button-monochrome button-sm">Signup</button>
          </li>
        </template>

        <!-- Logged in: show Account and Logout -->
        <template v-else>
          <li>
            <nuxt-link to="/account" class="o-site-navigation-link | button button-monochrome button-sm">Account</nuxt-link>
          </li>
          <li>
            <button @click.prevent="logout" class="o-site-navigation-link | button button-monochrome button-sm">Logout</button>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup>
const { loggedIn, clear } = useUserSession();
const { showDialog } = useDialog();
import { ViewsDialogSignup, ViewsDialogLogin } from "#components";

function openLogin() {
  showDialog({
    component: ViewsDialogLogin,
  });
}

function openSignup() {
  showDialog({
    component: ViewsDialogSignup,
  });
}

async function logout() {
  await clear();
  navigateTo("/");
}

const isLoggedIn = computed(() => loggedIn.value);
</script>

<style lang="scss">
@use "#styles/_utils/media.scss" as mq;

.o-site-navigation {
  color: var(--monochrome-900);
  background-color: var(--background-400);
}

.o-site-navigation__wrapper {
  display: flex;
  align-items: center;
}

.o-site-navigation-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: var(--size-8);

  @include mq.desktop {
    gap: var(--size-8);
  }
}

.o-site-navigation-link {
  white-space: nowrap;
  text-decoration: none;
  color: inherit;
}
</style>
