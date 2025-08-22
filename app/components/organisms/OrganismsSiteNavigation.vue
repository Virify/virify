<template>
  <nav class="o-site-navigation">
    <ul class="o-site-navigation-list">
      <template v-if="!loggedIn">
        <li>
          <button @click.prevent="openLogin" class="o-site-navigation-link | body-sm button button-tertiary button-sm">Log in</button>
        </li>
        <li>
          <button @click.prevent="openForgotPassword"
            class="o-site-navigation-link | button button-monochrome button-sm">Signup</button>
        </li>
      </template>

      <!-- <li v-else>
        <MoleculesNavPopover :options="navigationGroups" />
      </li> -->
    </ul>
  </nav>
</template>

<script setup>
const { loggedIn } = useUserSession()
const { showDialog } = useDialog()
import { ViewsDialogSignup, ViewsDialogLogin } from '#components';
import { navigationGroups } from '~/utils/account/navigation';

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
</script>

<style lang="scss">
@use "#styles/_utils/media.scss" as mq;

.o-site-navigation {
  color: var(--monochrome-900);
  background-color: var(--background-400);
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