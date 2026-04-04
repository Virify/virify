<template>
  <div>
    <OrganismsBannerHero
      class="container"
      compact
      :description="guide?.excerpt"
    >
      <template #top>
        <UBreadcrumb
          :items="[
            { label: 'Guides', to: '/guides', icon: 'i-lucide-home' },
            { label: guide?.category?.title || '', to: guide?.category ? `/guides/${guide.category.slug.current}` : undefined, icon: 'i-lucide-book-open' },
            { label: guide?.title || '', to: undefined, icon: 'i-lucide-file-text' }
          ]"
          :ui="{
            linkLeadingIcon: 'text-secondary',
            link: 'text-white truncate max-w-[20ch]',
          }"
          class="text-white pt-2 pb-2"
        />
      </template>

      <template #title>
        {{ guide?.title }}
      </template>
    </OrganismsBannerHero>

    <UContainer class="max-w-[75ch] py-8">
      <div class="relative w-full aspect-video rounded-lg overflow-hidden my-8">
      <NuxtImg
        provider="sanity" 
        :src="guide?.heroImage?.asset._ref"
        :alt="guide?.heroImage?.alt || guide?.title || 'Guide Hero Image'"
        :width="800"
        :height="450"
        class="absolute inset-0 w-full h-full object-cover"
        placeholder="/img/preload.svg"
        loading="eager"
        fetchpriority="high"
      />
    </div>
    <div class="flex flex-wrap gap-2 pb-4 items-center">
      <UAvatar src="/android-chrome-96x96.png" alt="Virify" text="Virify" />
      <p class="body-md font-semibold">Virify</p>
      <UBadge
        :label="guide?.readTime + ' min read'"
        variant="outline"
        color="neutral"
        size="lg"
      />
      <UBadge
        :label="formattedDate(guide?._updatedAt!)"
        variant="outline"
        color="neutral"
        size="lg"
      />
    </div>
    <SanityContent v-if="guide?.content" :blocks="guide?.content" />
  </UContainer>
  </div>

</template>

<script setup lang="ts">

const route = useRoute()
const guideSlug = route.params.guide as string

const { data: guide } = await useSanityQuery<GuideWithCategory>(guideBySlugQuery, { slug: guideSlug })

const formattedDate = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

// SEO metadata - Nuxt SEO module handles schema.org automatically
if (guide.value) {
  const seoTitle = guide.value.seo?.metaTitle || `${guide.value.title} | Virify`;
  const seoDescription = guide.value.seo?.metaDescription || guide.value.excerpt || '';
  const guideUrl = `https://virify.co.uk/guides/${guide.value.category?.slug.current}/${guideSlug}`;
  
  // SEO Meta tags - Nuxt SEO automatically generates WebPage/Article schema from this
  useSeoMeta({
    title: seoTitle,
    description: seoDescription,
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    ogType: 'article',
    ogUrl: guideUrl,
    twitterCard: 'summary_large_image',
    articlePublishedTime: guide.value.publishedAt,
    articleModifiedTime: guide.value.updatedAt || guide.value.publishedAt,
  });

  // Canonical URL
  useHead({
    link: [
      { rel: 'canonical', href: guideUrl }
    ],
  });

  // Custom schemas only - breadcrumbs (auto schema from useSeoMeta not sufficient)
  useSchemaOrg([
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://virify.co.uk' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://virify.co.uk/guides' },
        { '@type': 'ListItem', position: 3, name: guide.value.category?.title || '', item: `https://virify.co.uk/guides/${guide.value.category?.slug.current}` },
        { '@type': 'ListItem', position: 4, name: guide.value.title, item: guideUrl }
      ]
    }
  ]);
}
</script>