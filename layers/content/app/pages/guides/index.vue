<template>
  <div class="guides-home | container">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <AtomsGuideHero title="Virify Guides" description="From your very first step to your biggest leap, our guides help keep your marketing moving in the right direction." />

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
  const baseDescription = 'From your very first step to your biggest leap, our comprehensive guides help keep your property marketing moving in the right direction.';
  return categoryNames 
    ? `${baseDescription} Browse categories: ${categoryNames}.`
    : baseDescription;
});

useSeoMeta({
  title: 'Virify Guides - Property Marketing & Investment Insights',
  description: seoDescription,
  ogTitle: 'Virify Guides - Property Marketing & Investment Insights',
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
