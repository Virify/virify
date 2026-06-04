<template>
  <OrganismsBannerHero :caption>
    <template #title>
      <span>{{ title }}</span>
    </template>

    <HomepageSectionSignupForm v-if="!signup" />

    <template v-else-if="!signupAndLoggedIn">
      <p class="homepage-section-signup__content">Create an account or log in to enquire about properties listed by property agents. And coming soon, create your listing and search for other properties to buy and rent</p>

      <HeaderActionsGuest class="homepage-section-signup__buttons" />
    </template>

    <template v-else>
      <p class="homepage-section-signup__content">We’re excited to welcome professional property agents into early access testing. A few key features are still being switched on (including our advanced property search and private listings) - but we’re moving quickly and updates are landing regularly. Keep checking back!</p>
    </template>

  </OrganismsBannerHero>
</template>

<script setup lang="ts">
const { signup, role } = useFeatureFlag()

const signupAndLoggedIn = computed(() => {
  return signup && role.value && role.value !== 'PUBLIC'
})

const caption = computed(() => {
  if (signupAndLoggedIn.value) {
    return 'Welcome to Virify'
  }

  if (!signup) {
    return 'Launching Summer 2026'
  }

  return 'Now live for early testing'
})

const title = computed(() => {
  if (signupAndLoggedIn.value) {
    return 'The property platform that works for everyone'
  }

  if (!signup) {
    return 'Join the waiting list for the property platform that works for everyone'
  }

  return 'Sign up now for the property platform that works for everyone'
})

</script>

<style lang="scss">
.homepage-section-signup {

  &__content {
    max-width: 55ch;
    color: var(--monochrome-900);
  }

  &__buttons {
    margin: var(--size-24) auto;
  }
}
</style>