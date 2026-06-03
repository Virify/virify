<template>
  <div class="legal-page">
    <section v-if="pending" class="legal-page__content | container">
      <div class="legal-page__loading">Loading...</div>
    </section>
    
    <section v-else-if="error" class="legal-page__content | container">
      <h1 class="legal-page__title | title-2xl">Acceptable Use Policy</h1>
      <p class="legal-page__error">Failed to load acceptable use policy. Please try again later.</p>
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

const { data, pending, error } = await useSanityQuery<PolicyPage>(acceptableUseQuery)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

definePageMeta({
  alias: ['/legal/acceptable-use']
})

// SEO - Nuxt SEO auto-generates WebPage schema from this
useSeoMeta({
  title: 'Acceptable Use Policy — Virify',
  description: 'The acceptable use policy governing how you may use the Virify UK property marketplace platform.',
  ogTitle: 'Acceptable Use Policy — Virify',
  ogDescription: 'The acceptable use policy governing how you may use Virify.',
  ogType: 'website',
  ogUrl: 'https://virify.co.uk/acceptable-use',
  twitterCard: 'summary',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://virify.co.uk/acceptable-use' }
  ],
})

// Custom breadcrumbs
useSchemaOrg([
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://virify.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Acceptable Use Policy', item: 'https://virify.co.uk/acceptable-use' }
    ]
  }
])
</script>