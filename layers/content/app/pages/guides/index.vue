<template>
  <div class="guides-home | container">
    <h1>Guides</h1>
    <div v-if="pending">Loading categories...</div>
    <div v-else-if="categories" class="categories-grid">
      <div 
        v-for="category in categories" 
        :key="category._id"
        class="category-card"
      >
        <h2>{{ category.title }}</h2>
        <p v-if="category.description">{{ category.description }}</p>
        <NuxtLink :to="`/guides/${category.slug.current}`">
          View Guides
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

// Guides homepage
const { useCategories } = useSanity()

const { data: categories, pending } = await useCategories()
</script>

<style scoped>
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.category-card {
  padding: 1.5rem;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}
</style>