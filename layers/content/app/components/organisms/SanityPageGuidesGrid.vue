<template>
  <UPageSection
      :title="title"
      :description="description"
      headline="Helpful Guides"
      :ui="{
        headline: 'text-secondary',
      }"
    >
      <UBlogPosts>
        <UBlogPost
          v-for="(guide, index) in guides"
          :key="index"
          variant="subtle"
          :title="guide.title"
          :description="guide.excerpt"
          :to="
            '/guides/' + guide.category.slug.current + '/' + guide.slug.current
          "
          :badge="'Read Time: ' + guide.readTime + ' mins'"
          :date="guide.publishedAt"
          :authors="[
            {
              name: 'Virify',
              avatar: { src: '/android-chrome-96x96.png', alt: 'Virify' },
            },
          ]"
          :image="{
            provider: 'sanity',
            src: guide.heroImage?.asset._ref,
            alt: guide.heroImage?.alt || guide.title,
            width: 800,
            height: 600,
            loading: index < 3 ? 'eager' : 'lazy',
          }"
          :ui="{
            title: 'body-md font-bold',
            meta: 'justify-between',
            description: 'body-sm',
            body: 'justify-evenly',
          }"
        />
      </UBlogPosts>
    </UPageSection>
</template>
<script setup lang="ts">
interface Props {
  description?: string;
  title?: string;
  guides: (Omit<Guide, "category"> & {
    category: GuideCategory;
  })[];
}

const props = defineProps<Props>();
</script>