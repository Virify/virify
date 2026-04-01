<template>
  <div>
    <OrganismsBannerHero
      class="container"
      compact
      :description="category?.description"
    >
      <template #top>
        <UBreadcrumb
          :items="[
            { label: 'Guides', to: '/guides', icon: 'i-lucide-home' },
            { label: category?.title || '', to: category ? `/guides/${category.slug.current}` : undefined, icon: 'i-lucide-book-open' }
          ]"
          :ui="{
            linkLeadingIcon: 'text-secondary',
          }"
          class="text-white pt-2 pb-2"
        />
      </template>

      <template #title>
        <span class="gradient-text">{{ category?.title }}</span>
      </template>
    </OrganismsBannerHero>

    <UBlogPosts class="pt-8 pb-8 | container">
      <UBlogPost
        v-for="(guide, index) in category?.guides"
        :key="index"
        variant="subtle"
        :title="guide?.title"
        :description="guide?.excerpt"
        :to="'guides/' + guide?.slug.current"
        :badge="'Read Time: ' + guide.readTime + ' mins'"
        :date="guide?.publishedAt"
        :authors="[
          {
            name: 'Virify',
            avatar: {
              src: '/android-chrome-96x96.png',
              alt: 'Virify',
            }
          }

        ]"
        :image="{
          provider: 'sanity',
          src: guide.heroImage?.asset._ref,
          alt: guide.heroImage?.alt || guide.title,
          width: 600,
          height: 400,
          loading: index < 2 ? 'eager' : 'lazy',
          format: 'webp',
          quality: 85,
          sizes: 'sm:100vw md:50vw lg:33vw',
          preload: index === 0,
          placeholder: '/img/preload.svg',
        }"
        :ui="{
          title: 'body-md font-bold',
          meta: 'justify-between',
          description: 'body-sm',
          body: 'justify-evenly',
        }"
      />
    </UBlogPosts>
  </div>
</template>

<script setup lang="ts">

const route = useRoute();
const categorySlug = route.params.category as string;


const { data: category } = await useSanityQuery<GuideCategory>(categoryBySlugQuery, { slug: categorySlug });


// SEO metadata - Nuxt SEO auto-generates CollectionPage schema
const seoTitle = computed(() =>
  category.value ? `${category.value.title} - Property Guides | Virify` : 'Category Not Found - Virify'
);

const seoDescription = computed(() =>
  category.value?.description || 'Explore our property guides to help you navigate buying, selling, and renting in the UK.'
);

const categoryUrl = computed(() => `https://virify.co.uk/guides/${categorySlug}`);

// Nuxt SEO auto-generates CollectionPage/WebPage schema from this
useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogUrl: categoryUrl,
  twitterCard: 'summary_large_image',
});

useHead({
  link: [
    { rel: 'canonical', href: categoryUrl }
  ],
});

// Custom breadcrumbs - auto schema not sufficient
useSchemaOrg([
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://virify.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://virify.co.uk/guides' },
      { '@type': 'ListItem', position: 3, name: category.value?.title || categorySlug, item: categoryUrl.value }
    ]
  }
]);
</script>
