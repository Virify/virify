<template>
  <div class="guide-page | container">
    <div v-if="pending">Loading guide...</div>
    <article v-else-if="guide" class="guide-article">
      <header class="guide-header">
        <nav class="breadcrumb">
          <NuxtLink to="/guides">Guides</NuxtLink>
          <span>/</span>
          <NuxtLink v-if="guide.category" :to="`/guides/${guide.category.slug.current}`">
            {{ guide.category.title }}
          </NuxtLink>
          <span>/</span>
          <span>{{ guide.title }}</span>
        </nav>
        
        <h1>{{ guide.title }}</h1>
        
        <div v-if="guide.excerpt" class="guide-excerpt">
          {{ guide.excerpt }}
        </div>
        
        <div class="guide-meta">
          <span v-if="guide.readTime" class="read-time">{{ guide.readTime }} min read</span>
          <span v-if="guide.publishedAt" class="published-date">
            Published {{ formatDate(guide.publishedAt) }}
          </span>
          <span v-if="guide.updatedAt && guide.updatedAt !== guide.publishedAt" class="updated-date">
            Updated {{ formatDate(guide.updatedAt) }}
          </span>
        </div>

        <div v-if="guide.tags && guide.tags.length > 0" class="guide-tags">
          <span v-for="tag in guide.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </header>

      <div v-if="guide.heroImage" class="hero-image">
        <img :src="guide.heroImage.asset?.url" :alt="guide.heroImage.alt || guide.title" />
      </div>

      <div class="guide-content">
        <SanityContent v-if="guide.content" :blocks="guide.content" />
      </div>
    </article>
    
    <div v-else>
      <h1>Guide not found</h1>
      <NuxtLink to="/guides">← Back to guides</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.category as string
const guideSlug = route.params.guide as string

const { useGuideBySlug } = useSanity()

const { data: guide, pending } = await useGuideBySlug(guideSlug)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Set page meta if guide exists and has SEO data
if (guide.value) {
  useSeoMeta({
    title: guide.value.seo?.metaTitle || guide.value.title,
    description: guide.value.seo?.metaDescription || guide.value.excerpt,
    ogTitle: guide.value.seo?.metaTitle || guide.value.title,
    ogDescription: guide.value.seo?.metaDescription || guide.value.excerpt,
    ogImage: guide.value.heroImage?.asset?.url,
  })
}
</script>

<style scoped>
.guide-article {
  margin: 0 auto;
}

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

.guide-header {
  margin-bottom: 2rem;
}

.guide-header h1 {
  font-size: 2.5rem;
  line-height: 1.2;
  margin: 1rem 0;
}

.guide-excerpt {
  font-size: 1.25rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.guide-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #888;
}

.guide-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f3f4f6;
  color: #374151;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.hero-image {
  margin-bottom: 3rem;
}

.hero-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
}

.guide-content {
  line-height: 1.7;
  font-size: 1.125rem;
}

.guide-content :deep(h1),
.guide-content :deep(h2),
.guide-content :deep(h3),
.guide-content :deep(h4) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.guide-content :deep(h1) { font-size: 2rem; }
.guide-content :deep(h2) { font-size: 1.5rem; }
.guide-content :deep(h3) { font-size: 1.25rem; }
.guide-content :deep(h4) { font-size: 1.125rem; }

.guide-content :deep(p) {
  margin-bottom: 1.5rem;
}

.guide-content :deep(ul),
.guide-content :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.guide-content :deep(li) {
  margin-bottom: 0.5rem;
}

.guide-content :deep(blockquote) {
  border-left: 4px solid #e5e5e5;
  padding-left: 1rem;
  margin: 2rem 0;
  font-style: italic;
  color: #666;
}

.guide-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 2rem 0;
}
</style>