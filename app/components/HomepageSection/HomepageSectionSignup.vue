<template>
  <OrganismsBannerHero :caption>
    <template #title>
      <span>{{ title }}</span>
    </template>

    <HomepageSectionSignupForm v-if="!signup" />

    <template v-else-if="!signupAndLoggedIn">
      <p class="homepage-section-signup__content">
        We’re reviewing everything you’ve told us and making improvements, keep an eye out for what’s next.
      </p>

      <HeaderActionsGuest class="homepage-section-signup__buttons" />
    </template>

    <template v-else>
      <p
        class="homepage-section-signup__content homepage-section-signup__content--no-button"
      >
        We’re reviewing everything you’ve told us and making improvements, keep an eye out for what’s next.
      </p>
    </template>
  </OrganismsBannerHero>
</template>

<script setup lang="ts">
  const { signup, role } = useFeatureFlag();

  const signupAndLoggedIn = computed(() => {
    return signup && role.value && role.value !== "PUBLIC";
  });

  const caption = computed(() => {
    if (signupAndLoggedIn.value) {
      return "Welcome to Virify";
    }

    if (!signup) {
      return "Launching Summer 2026";
    }

    return "Early access testing is now over";
  });

  const title = computed(() => {
    if (signupAndLoggedIn.value) {
      return "The property platform that works for everyone";
    }

    if (!signup) {
      return "Join the waiting list for the property platform that works for everyone";
    }

    return "Thank you to everyone who took part - your feedback is helping shape Virify";
  });
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
