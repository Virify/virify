<template>
  <div class="guides-home | container">
    <MoleculesGuideBreadcrumb :items="breadcrumbItems" />

    <AtomsGuideHero title="Virify Guides" description="Complete step-by-step guides for buying, selling, and renting properties. Learn how to find the right property, negotiate deals, and navigate the entire process with confidence." />

    <MoleculesGuideGrid>
      <MoleculesGuideCard 
      v-for="category in categories" 
      :key="category._id" 
      :title="category.title" 
      :description="category.description" 
      :to="`/guides/${category.slug.current}`" 
      :icon="category.icon || 'content/info'" />
    </MoleculesGuideGrid>

    <section>
      <div class="guides-home__advert">
        <MoleculesListingAdvert />
      </div>
    </section>

    <section>
      <OrganismsRelevantListings type="trending" title="Trending" :days="7" :limit="10" />
    </section>
  </div>
</template>

<script setup lang="ts">
const { useCategories } = useSanity();

const { data: categories } = await useCategories();

const breadcrumbItems = computed(() => [{ label: "Guides", to: "/guides" }]);

// SEO metadata
const seoDescription = computed(() => {
  const categoryNames = categories.value?.map(cat => cat.title).join(', ') || '';
  const baseDescription = 'Complete step-by-step guides for buying, selling, and renting properties. Learn how to find properties, negotiate deals, finalize agreements, and use our platform effectively.';
  return categoryNames 
    ? `${baseDescription} Browse categories: ${categoryNames}.`
    : baseDescription;
});

useSeoMeta({
  title: 'Virify Guides - Complete Property Buying, Selling, Searching & Rental Guides',
  description: seoDescription,
  ogTitle: 'Virify Guides - Complete Property Buying, Selling, Searching & Rental Guides',
  ogDescription: seoDescription,
});
</script>

<style scoped lang="scss">
.guides-home {
  padding-bottom: var(--size-32);
  &__advert {
    padding: var(--size-32) 0;
    display: flex;
    justify-content: center;
  }
}
</style>
