<template>
  <div class="category-page | container">
    <div v-if="pending">Loading...</div>
    <div v-else-if="category">
      <header class="category-header">
        <nav class="breadcrumb">
          <NuxtLink to="/guides">Guides</NuxtLink>
          <span>/</span>
          <span>{{ category.title }}</span>
        </nav>
        
        <h1>{{ category.title }}</h1>
        <p v-if="category.description">{{ category.description }}</p>
      </header>

      <div v-if="guidesPending">Loading guides...</div>
      <div v-else-if="guides && guides.length > 0" class="guides-grid">
        <article 
          v-for="guide in guides" 
          :key="guide._id"
          class="guide-card"
        >
          <div v-if="guide.heroImage" class="guide-image">
            <img :src="guide.heroImage.asset?.url" :alt="guide.heroImage.alt || guide.title" />
          </div>
          <div class="guide-content">
            <h2>{{ guide.title }}</h2>
            <p v-if="guide.excerpt" class="guide-excerpt">{{ guide.excerpt }}</p>
            <div class="guide-meta">
              <span v-if="guide.readTime" class="read-time">{{ guide.readTime }} min read</span>
              <span v-if="guide.isFeatured" class="featured-badge">Featured</span>
            </div>
            <div v-if="guide.tags && guide.tags.length > 0" class="guide-tags">
              <span v-for="tag in guide.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <NuxtLink :to="`/guides/${categorySlug}/${guide.slug.current}`" class="read-more">
              Read Guide →
            </NuxtLink>
          </div>
        </article>
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
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.breadcrumb a {
  color: #2563eb;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.category-header {
  margin-bottom: 2rem;
}

.category-header h1 {
  margin-bottom: 0.5rem;
}

.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.guide-card {
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.guide-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.guide-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.guide-content {
  padding: 1.5rem;
}

.guide-content h2 {
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.guide-excerpt {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.guide-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #888;
}

.featured-badge {
  background: #f59e0b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.guide-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.read-more {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}

.no-guides {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}
</style>