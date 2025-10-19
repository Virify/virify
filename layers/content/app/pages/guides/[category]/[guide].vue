<template>
  <div class="guide-page | container">
    <article v-if="guide">
      <MoleculesBreadcrumb :items="breadcrumbItems" />
      
      <AtomsGuideHero 
        :title="guide.title"
        :description="guide.excerpt || ''"
        :image="guide.heroImage"
        :meta="heroMeta"
      />

      <div class="guide-page__layout">
        <!-- Main Content -->
        <div class="guide-page__content">
          <SanityContent v-if="guide.content" :blocks="guide.content" />
        </div>

        <!-- Table of Contents Sidebar -->
        <MoleculesGuideTableOfContents :content="guide.content || []" />
      </div>
    </article>
    <section v-if="!isWaitingListMode">
      <div class="guide-page__advert">
        <MoleculesListingAdvert />
      </div>
    </section>
    <section v-if="!isWaitingListMode">
      <OrganismsRelevantListings type="trending" title="Trending" :days="7" :limit="10" />
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const guideSlug = route.params.guide as string
const { isWaitingListMode } = useWaitingListMode()

const { useGuideBySlug } = useSanity()

const { data: guide } = await useGuideBySlug(guideSlug)

const breadcrumbItems = computed(() => [
  { label: "Guides", to: "/guides" },
  { label: guide.value?.category?.title ?? '', to: guide.value?.category ? `/guides/${guide.value.category.slug.current}` : undefined },
  { label: guide.value?.title ?? '' }
])

// Build hero meta pills
const heroMeta = computed(() => {
  const items: string[] = []
  if (guide.value?.readTime) items.push(`${guide.value.readTime} min read`)
  if (guide.value?.publishedAt) items.push(`Published ${formatDate(guide.value.publishedAt)}`)
  return items
})

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
    ogImage: guide.value.heroImage?.asset?.url,
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

<style scoped lang="scss">
@use "#styles/_utils/media" as mq;

.guide-page {
  margin: 0 auto;

  &__breadcrumb {
    padding: var(--size-16) 0;
  }

  &__meta {
    display: flex;
    gap: var(--size-12);
    margin-top: var(--size-32);
    flex-wrap: wrap;

    @include mq.mobile-only {
      margin-top: var(--size-16);
    }
  }

  &__pill {
    background: var(--background-200);
    color: var(--foreground-100);
    border: 1px solid var(--secondary-400);
  }

  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-32);

    @include mq.desktop {
      grid-template-columns: 2fr 1fr;
      gap: var(--size-48);
    }
  }

  &__content {
    min-width: 0;
  }

  &__advert {
    padding: var(--size-32) 0;
    display: flex;
    justify-content: center;
  }
}
</style>