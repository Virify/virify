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
          :icon="guide.icon || 'content/info'"
        />
      </MoleculesGuideGrid>
    </section>
    <section>
      <div class="category-page__advert">
        <MoleculesListingAdvert />
      </div>
    </section>
    <section>
      <OrganismsRelevantListings type="trending" title="Trending" :days="7" :limit="10" />
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const categorySlug = route.params.category as string;

const { useCategoryBySlug } = useSanity();

const { data: category } = await useCategoryBySlug(categorySlug);
const guides = computed(() => category.value?.guides || []);

const title = computed(() => (category.value ? category.value.title : "Category Not Found"));

const description = computed(() => (category.value && category.value.description ? category.value.description : "Explore our collection of guides to help you navigate your marketing journey."));

const image = computed(() => (category.value?.heroImage?.asset?._ref ? category.value?.heroImage : undefined));

const breadcrumbItems = computed(() => [{ label: "Guides", to: "/guides" }, { label: category.value?.title || categorySlug }]);

// SEO metadata
const seoTitle = computed(() => 
  category.value ? `${category.value.title} Guides - Virify` : 'Category Not Found - Virify'
);

const seoDescription = computed(() => 
  category.value?.description || 'Explore our collection of guides to help you navigate your marketing journey.'
);

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
});
</script>

<style scoped lang="scss">
.category-page {
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
