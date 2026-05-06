<template>
  <OrganismsBannerHero :caption>
    <template #title>
      <span>{{ title }}</span>
    </template>

    <template v-if="signup">
      <p class="homepage-section-signup__content">Create an account or log in to enquiry about listings from independent
        Estate Agents. And coming soon,
        create your listing and search for other properties to buy and rent</p>

      <HeaderActionsGuest class="homepage-section-signup__buttons" />
    </template>
    <HomepageSectionSignupForm v-else />

  </OrganismsBannerHero>
</template>

<script setup lang="ts">
const { signup } = useFeatureFlag()

const caption = signup ? 'Now live for early testing' : 'Launching Summer 2026'
const title = signup ? 'Sign up now for the property platform that works for everyone' : 'Join the waiting list for the property platform that works for everyone'

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