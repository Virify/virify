<template>
  <div class="category-page | container">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <AtomsGuideHero :title="title" :description="description" :image="image" />

    <section class="category-page__search">
      <OrganismsSearchInput
        :placeholder="`Search guides in ${title}`"
        icon="search"
        iconTitle="Search icon"
        :guides="fullGuides"
        :deleteble="true"
        @filter="filtered => filteredGuides = filtered as Guide[]"
      />
    </section>

    <section v-if="category && visibleGuides.length > 0">
      <MoleculesGuideGrid>
        <MoleculesGuideCard v-for="guide in visibleGuides" :key="guide._id" :title="guide.title"
          :to="`/guides/${categorySlug}/${guide.slug.current}`" :excerpt="guide.excerpt" :read-time="guide.readTime"
          :updated-at="guide._updatedAt" :is-featured="guide.isFeatured" :image="guide.heroImage" />
      </MoleculesGuideGrid>
    </section>

    <section v-if="fullGuides.length > 0 && visibleGuides.length === 0">
      <div class="| body-md">
        No guide categories found.
      </div>
    </section>

    <section v-if="!isWaitingListMode">
      <div class="category-page__advert">
        <MoleculesListingAdvert />
      </div>
    </section>
    <section v-if="!isWaitingListMode">
      <OrganismsRelevantListings type="trending" title="Trending" :days="7" :limit="10" />
    </section>
  </div>
</template>

<script setup lang="ts">

const route = useRoute();
const categorySlug = route.params.category as string;
const filteredGuides = ref<Guide[]>([]);

const { isWaitingListMode } = useWaitingListMode()

const { data: category } = await useSanityQuery<GuideCategory>(categoryBySlugQuery, { slug: categorySlug });

const fullGuides = computed(() => {
  return category.value?.guides || [];
});

const title = computed(() => (category.value ? category.value.title : "Category Not Found"));

const description = computed(() => (category.value && category.value.description ? category.value.description : "Explore our collection of guides to help you navigate your marketing journey."));

const image = computed(() => (category.value?.heroImage?.asset?._ref ? category.value?.heroImage : undefined));

const breadcrumbItems = computed(() => [{ label: "Guides", to: "/guides" }, { label: category.value?.title || categorySlug }]);

const visibleGuides = computed(() => {
  if (filteredGuides.value.length > 0) return filteredGuides.value;
  return fullGuides.value;
});

// SEO metadata - Nuxt SEO auto-generates CollectionPage schema
const seoTitle = computed(() =>
  category.value ? `${category.value.title} - Property Guides | Virify` : 'Category Not Found - Virify'
);

const seoDescription = computed(() =>
  category.value?.description || 'Explore our property guides to help you navigate buying, selling, and renting in the UK.'
);

const categoryUrl = computed(() => `https://virify.co.uk/guides/${categorySlug}`);

// Nuxt SEO auto-generates CollectionPage/WebPage schema from this
useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogUrl: categoryUrl,
  twitterCard: 'summary_large_image',
});

useHead({
  link: [
    { rel: 'canonical', href: categoryUrl }
  ],
});

// Custom breadcrumbs - auto schema not sufficient
useSchemaOrg([
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://virify.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://virify.co.uk/guides' },
      { '@type': 'ListItem', position: 3, name: category.value?.title || categorySlug, item: categoryUrl.value }
    ]
  }
]);
</script>

<style scoped lang="scss">
.category-page {
  padding-bottom: var(--size-32);

  &__breadcrumb {
    padding: var(--size-16) 0;
  }

  &__search {
    margin: var(--size-32) 0;
  }

  &__advert {
    padding: var(--size-32) 0;
    display: flex;
    justify-content: center;
  }
}
</style>
