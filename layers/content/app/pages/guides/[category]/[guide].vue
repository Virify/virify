<template>
  <div class="guide-page | container">
    <article v-if="guide">
      <MoleculesGuideBreadcrumb :items="breadcrumbItems" />
      
      <AtomsGuideHero 
        :title="guide.title"
        :description="guide.excerpt || ''"
        :image="guide.heroImage"
      />
      
      <div class="guide-page__meta">
        <AtomsPill v-if="guide.readTime" class="guide-page__pill">
          {{ guide.readTime }} min read
        </AtomsPill>
        <AtomsPill v-if="guide.publishedAt" class="guide-page__pill">
          Published {{ formatDate(guide.publishedAt) }}
        </AtomsPill>
      </div>

      <div class="guide-page__layout">
        <!-- Main Content -->
        <div class="guide-page__content">
          <SanityContent v-if="guide.content" :blocks="guide.content" />
        </div>

        <!-- Table of Contents Sidebar -->
        <MoleculesGuideTableOfContents :content="guide.content || []" />
      </div>
    </article>
    <section>
      <div class="guide-page__advert">
        <MoleculesListingAdvert />
      </div>
    </section>
    <section>
      <OrganismsRelevantListings type="trending" title="Trending" :days="7" :limit="10" />
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const guideSlug = route.params.guide as string

const { useGuideBySlug } = useSanity()

const { data: guide } = await useGuideBySlug(guideSlug)

const breadcrumbItems = computed(() => [
  { label: "Guides", to: "/guides" },
  { label: guide.value?.category?.title ?? '', to: guide.value?.category ? `/guides/${guide.value.category.slug.current}` : undefined },
  { label: guide.value?.title ?? '' }
])

// Set page meta if guide exists and has SEO data
if (guide.value) {
  useSeoMeta({
    title: guide.value.seo?.metaTitle || guide.value.title,
    description: guide.value.seo?.metaDescription || guide.value.excerpt,
    ogTitle: guide.value.seo?.metaTitle || guide.value.title,
    ogDescription: guide.value.seo?.metaDescription || guide.value.excerpt,
    ogImage: guide.value.heroImage?.asset?.url,
  })
}
</script>

<style scoped lang="scss">
@use "#styles/_utils/media" as mq;

.guide-page {
  margin: 0 auto;

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