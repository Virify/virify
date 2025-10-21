<template>
  <div class="legal-page | container">
    <section v-if="pending" class="legal-page__content">
      <div class="legal-page__loading">Loading...</div>
    </section>
    
    <section v-else-if="error" class="legal-page__content">
      <h1 class="legal-page__title | title-2xl">Terms & Conditions</h1>
      <p class="legal-page__error">Failed to load terms. Please try again later.</p>
    </section>
    
    <section v-else-if="data" class="legal-page__content">
      <h1 class="legal-page__title | title-2xl">{{ data.title }}</h1>
      <p class="legal-page__updated | body-xs" v-if="data.lastUpdated">
        Last updated: {{ formatDate(data.lastUpdated) }}
      </p>
      
      <SanityContent v-if="data.content" :blocks="data.content" />
    </section>
  </div>
</template>

<script setup lang="ts">

const { data, pending, error } = await useSanityQuery<PolicyPage>(termsQuery)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

definePageMeta({
  alias: ['/terms-and-conditions', '/legal/terms']
})

// SEO - Nuxt SEO auto-generates WebPage schema from this
useSeoMeta({
  title: 'Terms & Conditions — Virify',
  description: 'The terms that govern your use of Virify UK property marketplace platform.',
  ogTitle: 'Terms & Conditions — Virify',
  ogDescription: 'The terms that govern your use of Virify.',
  ogType: 'website',
  ogUrl: 'https://virify.co.uk/terms',
  twitterCard: 'summary',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://virify.co.uk/terms' }
  ],
})

// Custom breadcrumbs
useSchemaOrg([
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://virify.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Terms & Conditions', item: 'https://virify.co.uk/terms' }
    ]
  }
])
</script>

<style lang="scss">
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
}
</style>
