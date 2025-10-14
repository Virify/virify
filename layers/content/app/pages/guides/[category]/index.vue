<template>
  <div class="category-page | container">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <AtomsGuideHero :title="title" :description="description" :image="image" />

    <section v-if="category && guides.length > 0">
      <MoleculesGuideGrid>
        <MoleculesGuideCard
          v-for="guide in guides"
          :key="guide._id"
          :title="guide.title"
          :to="`/guides/${categorySlug}/${guide.slug.current}`"
          :excerpt="guide.excerpt"
          :read-time="guide.readTime"
          :published-at="guide.publishedAt"
          :is-featured="guide.isFeatured"
          :image="guide.heroImage"
        />
      </MoleculesGuideGrid>
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

const { useCategoryBySlug } = useSanity();
const { isWaitingListMode } = useWaitingListMode()

const { data: category } = await useCategoryBySlug(categorySlug);
const guides = computed(() => category.value?.guides || []);

const title = computed(() => (category.value ? category.value.title : "Category Not Found"));

const description = computed(() => (category.value && category.value.description ? category.value.description : "Explore our collection of guides to help you navigate your marketing journey."));

const image = computed(() => (category.value?.heroImage?.asset?._ref ? category.value?.heroImage : undefined));

const breadcrumbItems = computed(() => [{ label: "Guides", to: "/guides" }, { label: category.value?.title || categorySlug }]);

// SEO metadata
const seoTitle = computed(() => 
  category.value ? `${category.value.title} - Property Guides | Virify` : 'Category Not Found - Virify'
);

const seoDescription = computed(() => 
  category.value?.description || 'Explore our property guides to help you navigate buying, selling, and renting in the UK.'
);

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  robots: 'index, follow',
  
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogUrl: computed(() => `https://virify.co.uk/guides/${categorySlug}`),
  
  twitterCard: 'summary',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
});

useHead({
  link: [
    { rel: 'canonical', href: computed(() => `https://virify.co.uk/guides/${categorySlug}`) }
  ],
});
</script>

<style scoped lang="scss">
.category-page {
  padding-bottom: var(--size-32);
  &__breadcrumb {
    padding: var(--size-16) 0;
  }
  
  &__advert {
    padding: var(--size-32) 0;
    display: flex;
    justify-content: center;
  }
}
</style>
