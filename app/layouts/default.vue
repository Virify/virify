<template>
  <NuxtLoadingIndicator />
  <HeaderBase />

  <div class="page">
    <NuxtPage />
  </div>

  <OrganismsFooter />

  <ViewsDialog />
</template>

<script setup lang="ts">
import { ViewsDialogLogin, ViewsDialogPasswordReset } from '#components'
import { useDark } from '@vueuse/core'

const isDark = useDark()

onMounted(() => {
  // Migrate users who had the old 'theme' localStorage key
  const legacyTheme = localStorage.getItem('theme')
  if (legacyTheme) {
    isDark.value = legacyTheme === 'dark'
    localStorage.removeItem('theme')
  }
})

onMounted(async () => {
  const { path, query } = useRoute()

  const { showDialog } = useDialog()

  // Check if we should show the password reset dialog (from email link)
  if (query.showResetPassword && query.passwordToken) {
    const cleanQuery = objectWithoutKey(objectWithoutKey(query, 'showResetPassword'), 'passwordToken')
    showDialog({
      component: ViewsDialogPasswordReset,
      props: { passwordToken: query.passwordToken as string },
      onClose: async () => {
        await navigateTo({ path, query: cleanQuery }, { replace: true })
      }
    })
    return
  }

  // Check if we should show the login dialog (from authentication middleware)
  if (!query.showLogin) return

  const { loggedIn } = useUserSession()
  const cleanQuery = objectWithoutKey(query, 'showLogin')

  // User is already logged in, just clean up the URL
  if (loggedIn.value) {
    const cleanQuery = { ...query }
    delete cleanQuery.showLogin

    return await navigateTo({
      path,
      query: cleanQuery
    }, { replace: true })
  }

  // Only show if user is still not logged in - check if there's a
  // redirect cookie to determine if user came from a protected page
  const redirectCookie = useCookie('redirect')
  const fromProtectedPage = !!redirectCookie.value

  showDialog({
    component: ViewsDialogLogin,
    props: {
      fromProtectedPage
    },
    onClose: async () => {
      await navigateTo({
        path,
        query: cleanQuery
      }, { replace: true })
    }
  })
})

// Pre-initialise lookup composables so their useAsyncData keys are in the Nuxt SSR
// payload on hard refresh. Without this, useFavouriteLookups / useNoteLookups only
// initialise when AtomsFavouriteButton / AtomsNoteButton mount (client-side on search
// pages), causing empty icons and "Add Note" on first render.
useFavouriteLookups()
useNoteLookups()

useHead({
  htmlAttrs: {
    lang: "en-GB",
  },
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "anonymous",
    },
    {
      rel: "preload",
      as: "style",
      href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;600;700&display=swap",
      onload: 'this.onload=null; this.rel="stylesheet"',
    },
    {
      rel: "preload",
      as: "image",
      href: "/img/preload.svg",
    },
  ],
});
</script>

<style lang="scss">
.page {
  background: var(--background-200);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
}
</style>
