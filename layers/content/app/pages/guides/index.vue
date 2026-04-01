<template>
  <div>
    <OrganismsBannerHero
      class="container"
      description="Complete step-by-step guides for buying, selling, and renting properties."
    >
      <template #top>
        <UBreadcrumb
          :items="[
            { label: 'Guides', to: '/guides', icon: 'i-lucide-home' },
          ]"
          :ui="{
            linkLeadingIcon: 'text-secondary',
          }"
          class="text-white pt-2 pb-2"
        />
      </template>

      <template #title>
        Virify <span class="gradient-text">Guides</span>
      </template>
    </OrganismsBannerHero>

    <UBlogPosts class="pt-8 pb-8 | container">
      <UBlogPost
        v-for="(category, index) in categories"
        :key="index"
        variant="subtle"
        :title="category.title"
        :description="category.description"
        :to="'guides/' + category.slug.current"
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
          src: category.heroImage?.asset._ref,
          alt: category.heroImage?.alt || category.title,
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

const { data: categories } = await useSanityQuery<GuideCategory[]>(categoriesQuery)

// SEO - Nuxt SEO auto-generates CollectionPage schema from this
const seoDescription = computed(() => {
  const categoryNames = categories.value?.map(cat => cat.title).join(', ') || '';
  const baseDescription = 'Complete guides for buying, selling, and renting property in the UK. Expert advice on property search, negotiations, and using AI-powered tools.';
  return categoryNames 
    ? `${baseDescription} Browse: ${categoryNames}.`
    : baseDescription;
});

useSeoMeta({
  title: 'Property Guides UK - Buying, Selling & Renting Advice | Virify',
  description: seoDescription,
  keywords: 'property buying guide UK, how to sell house, property search tips, rental guide, house buying advice, estate agent alternative guide',
  ogTitle: 'Property Guides UK - Buying, Selling & Renting Advice | Virify',
  ogDescription: seoDescription,
  ogType: 'website',
  ogUrl: 'https://virify.co.uk/guides',
  twitterCard: 'summary_large_image',
});

useHead({
  link: [
    { rel: 'canonical', href: 'https://virify.co.uk/guides' }
  ],
});

// Custom breadcrumbs
useSchemaOrg([
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://virify.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://virify.co.uk/guides' }
    ]
  }
]);

</script>
