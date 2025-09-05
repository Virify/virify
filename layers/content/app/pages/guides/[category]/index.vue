<template>
  <div class="category-page | container">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <AtomsGuideHero 
      :title="category ? category.title : 'Category Not Found'" 
      :description="category && category.description ? category.description : 'Explore our collection of guides to help you navigate your marketing journey.'"
    />

    <div v-if="pending">Loading...</div>
    <div v-else-if="category">

      <div v-if="guidesPending">Loading guides...</div>
      <div v-else-if="guides && guides.length > 0" class="guides-grid">
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
      <div v-else class="no-guides">
        <p>No guides available in this category yet.</p>
      </div>
    </div>
    <div v-else>
      <h1>Category not found</h1>
      <NuxtLink to="/guides">← Back to all categories</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.category as string

const { useCategoryBySlug } = useSanity()

const { data: category, pending } = await useCategoryBySlug(categorySlug)
const guides = computed(() => category.value?.guides || [])
const guidesPending = pending

const breadcrumbItems = computed(() => [
  { label: 'Guides', to: '/guides' },
  { label: category.value?.title || categorySlug }
])
</script>

<style scoped lang="scss">

.category-header {
  margin-bottom: 2rem;
}

.category-header h1 {
  margin-bottom: 0.5rem;
}

.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  padding: var(--size-32) 0;
  justify-items: start;
}


.no-guides {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}
</style>