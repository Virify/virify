<template>
  <div class="category-page | container">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <AtomsGuideHero :title="category ? category.title : 'Category Not Found'" :description="category && category.description ? category.description : 'Explore our collection of guides to help you navigate your marketing journey.'" />
    <div v-if="category">
      <div v-if="guides && guides.length > 0" class="category-page__categories">
        <MoleculesGuideCard
          v-for="guide in guides"
          :key="guide._id"
          :title="guide.title"
          :to="`/guides/${categorySlug}/${guide.slug.current}`"
          :excerpt="guide.excerpt"
          :read-time="guide.readTime"
          :is-featured="guide.isFeatured"
          icon="account/billing"
        />
      </div>
    </div>
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
    padding: var(--size-32) 0;
    justify-items: start;
  }
}

.no-guides {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}
</style>
