<template>
  <div class="legal-page">
    <section v-if="pending" class="legal-page__content | container">
      <div class="legal-page__loading">Loading...</div>
    </section>
    
    <section v-else-if="error" class="legal-page__content | container">
      <h1 class="legal-page__title | title-2xl">Cookie Policy</h1>
      <p class="legal-page__error">Failed to load cookie policy. Please try again later.</p>
    </section>
    
    <section v-else-if="data" class="legal-page__content | container">
      <h1 class="legal-page__title | title-2xl">{{ data.title }}</h1>
      <p class="legal-page__updated | body-xs" v-if="data.lastUpdated">
        Last updated: {{ formatDate(data.lastUpdated) }}
      </p>
      
      <SanityContent v-if="data.content" :blocks="data.content" />
    </section>
  </div>
</template>

<script setup lang="ts">

const { data, pending, error } = await useSanityQuery<PolicyPage>(cookieQuery)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

definePageMeta({
  alias: ['/cookie-policy', '/legal/cookie', '/cookies']
})

// SEO - Nuxt SEO auto-generates WebPage schema from this
useSeoMeta({
  title: 'Cookie Policy — Virify',
  description: 'How Virify uses cookies and similar technologies on our UK property marketplace platform.',
  ogTitle: 'Cookie Policy — Virify',
  ogDescription: 'How Virify uses cookies and similar technologies.',
  ogType: 'website',
  ogUrl: 'https://virify.co.uk/cookie',
  twitterCard: 'summary',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://virify.co.uk/cookie' }
  ],
})

// Custom breadcrumbs
useSchemaOrg([
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://virify.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Cookie Policy', item: 'https://virify.co.uk/cookie' }
    ]
  }
])
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.legal-page {
  margin: 0 auto;
  background: var(--background-200);

  &__content {
    display: block;
    padding: var(--size-24);
    color: var(--foreground-100);
  }

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
}
</style>
