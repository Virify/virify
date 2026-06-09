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
      <p class="homepage-section-signup__content homepage-section-signup__content--no-button">We’re excited to welcome property agents into early access. A few key features are still being switched on - but we’re moving quickly and updates are landing regularly.</p>
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
@use "#styles/_utils/media" as mq;
.homepage-section-signup {

  &__content {
    max-width: 55ch;
    color: var(--monochrome-900);

    &--no-button {
      padding-bottom: var(--size-72);

      @include mq.desktop {
        padding-bottom: 0;
      }
    } 
  }

  &__buttons {
    margin: var(--size-24) auto;
  }
}
</style>