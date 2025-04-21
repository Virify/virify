<template>
  <nav class="o-site-navigation">
    <ul class="o-site-navigation-list">
      <template v-if="!loggedIn">
        <li>
          <nuxt-link to="/login" class="o-site-navigation-link | body-sm font-bold">
            Log in
          </nuxt-link>
        </li>

        <li>
          <nuxt-link to="/signup" class="o-site-navigation-link | button button-monochrome button-sm">
            Create account
          </nuxt-link>
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

// logout function
async function logout() {
  await clear()
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