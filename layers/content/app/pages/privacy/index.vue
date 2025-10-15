<template>
  <div class="legal-page | container">
    <section v-if="pending" class="legal-page__content">
      <div class="legal-page__loading">Loading...</div>
    </section>
    
    <section v-else-if="error" class="legal-page__content">
      <h1 class="legal-page__title | title-2xl">Privacy Policy</h1>
      <p class="legal-page__error">Failed to load privacy policy. Please try again later.</p>
    </section>
    
    <section v-else-if="data" class="legal-page__content">
      <h1 class="legal-page__title | title-2xl">{{ data.title }}</h1>
      <p class="legal-page__updated | body-xs" v-if="data.updatedAt">
        Last updated: {{ formatDate(data.updatedAt) }}
      </p>
      
      <SanityContent v-if="data.content" :blocks="data.content" />
    </section>
  </div>
</template>

<script setup lang="ts">
const { usePrivacy } = useSanity()
const { data, pending, error } = await usePrivacy()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

definePageMeta({
  alias: ['/privacy-policy', '/legal/privacy']
})

useSeoMeta({
  title: 'Privacy Policy — Virify',
  description: 'How Virify collects, uses and protects your information.',
})
</script>

<style scoped lang="scss">
@use '#styles/_utils/media' as mq;

.legal-page {
  margin: 0 auto;
  padding-block: var(--size-24);

  > section + section {
    margin-top: var(--size-32);

    @include mq.desktop {
      margin-top: var(--size-48);
    }
  }

  &__title {
    margin-bottom: var(--size-8);
    color: var(--foreground-100);
  }

  &__updated {
    margin-bottom: var(--size-24);
    opacity: 0.9;
  }

  &__loading,
  &__error {
    padding: var(--size-24);
    text-align: center;
  }

  &__error {
    color: var(--error-500);
  }

  &__content {
    display: block;
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    padding: var(--size-24);
    color: var(--foreground-100);
  }

  &__content :deep(h2) {
    margin-top: var(--size-24);
    font-size: var(--font-lg);
  }

  &__content :deep(p),
  &__content :deep(ul) {
    margin-bottom: var(--size-16);
    font-size: var(--font-md);
  }

  &__content :deep(li) {
    margin-bottom: var(--size-8);
    font-size: var(--font-md);
  }
}
</style>
