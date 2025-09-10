<script setup lang="ts">
const error = useError();

const errorTitle = computed(() => {
  switch (error.value?.statusCode) {
    case 404:
      return 'Page Not Found'
    case 500:
      return 'Server Error'
    default:
      return 'Something went wrong'
  }
})

const errorMessage = computed(() => {
  switch (error.value?.statusCode) {
    case 404:
      return "Sorry, the page you're looking for doesn't exist or has been moved."
    case 500:
      return "We're experiencing technical difficulties. Please try again later."
    default:
      return error.value?.message || "An unexpected error occurred"
  }
})

function clearErrors() {
  clearError();
}
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <OrganismsHeader />

    <div class="page">
      <div class="error-page">
        <div class="container">
          <div class="error-page__content">
            <h1 class="error-page__title | title-lg">{{ errorTitle || 'Page Not Found' }}</h1>
            <p class="error-page__message | body-md">{{ errorMessage || 'The page you are looking for does not exist.' }}</p>
            
            <div class="error-page__actions">
              <NuxtLink to="/" class="button button-primary">
                Go Home
              </NuxtLink>
              <button @click="clearErrors" class="button button-secondary">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <OrganismsFooter />
    <ViewsDialog />
    <ViewsHelpButton />
    <MoleculesToastContainer />
  </div>
</template>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;

.error-page {
  min-height: calc(100vh - 200px); // Account for header and footer
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-64, 64px) var(--size-24, 24px);

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  &__content {
    text-align: center;
    max-width: 600px;
    width: 100%;
  }

  &__title {
    margin-bottom: var(--size-24, 24px);
    color: var(--foreground-100, #000);
  }

  &__message {
    margin-bottom: var(--size-48, 48px);
    color: var(--text-muted, #666);
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    gap: var(--size-16, 16px);
    justify-content: center;
    flex-wrap: wrap;

    @include mq.mobile-only {
      flex-direction: column;
      align-items: center;
      gap: var(--size-12, 12px);
    }

    .button {
      min-width: 140px;
    }
  }

  &__icon {
    margin-bottom: var(--size-24);
    color: var(--monochrome-500);
  }

  &__title {
    margin-bottom: var(--size-16);
    color: var(--foreground-100);
  }

  &__message {
    margin-bottom: var(--size-32);
    color: var(--text-muted);
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    gap: var(--size-16);
    justify-content: center;
    margin-bottom: var(--size-32);
    flex-wrap: wrap;

    @include mq.mobile-only {
      flex-direction: column;
      align-items: center;
    }

    .button {
      display: inline-flex;
      align-items: center;
      gap: var(--size-8);
      min-width: 140px;
      justify-content: center;
    }
  }

  &__help {
    padding-top: var(--size-24);
    border-top: 1px solid var(--monochrome-300);
    color: var(--text-muted);

    p {
      margin-bottom: var(--size-8);
    }

    .link {
      color: var(--secondary-400);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>