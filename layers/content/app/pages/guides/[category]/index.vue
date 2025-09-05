<template>
  <div class="category-page | container">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <AtomsGuideHero :title="category ? category.title : 'Category Not Found'" :description="category && category.description ? category.description : 'Explore our collection of guides to help you navigate your marketing journey.'" />
    
    <section v-if="category">
      <MoleculesGuideGrid>
        <MoleculesGuideCard
          v-for="guide in guides"
          :key="guide._id"
          :title="guide.title"
          :to="`/guides/${categorySlug}/${guide.slug.current}`"
          :excerpt="guide.excerpt"
          :read-time="guide.readTime"
          :is-featured="guide.isFeatured"
          :icon="guide.icon || 'content/info'"
        />
      </MoleculesGuideGrid>
    </section>
    <section>
      <div class="category-page__advert">
        <AtomsDivider />
        <MoleculesListingAdvert />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const categorySlug = route.params.category as string;

const { useCategoryBySlug } = useSanity();

const { data: category } = await useCategoryBySlug(categorySlug);
const guides = computed(() => category.value?.guides || []);

const breadcrumbItems = computed(() => [{ label: "Guides", to: "/guides" }, { label: category.value?.title || categorySlug }]);
</script>

<style scoped lang="scss">
.category-page {
  &__categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--size-24);
    margin-top: var(--size-32);
    justify-items: start;
  }

  &__advert {
    padding: var(--size-32) 0;
    display: flex;
    justify-content: center;
  }
}
</style>
