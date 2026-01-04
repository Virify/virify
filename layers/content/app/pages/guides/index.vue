<template>
  <div class="guides-home | container">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <AtomsGuideHero title="Virify Guides" description="Complete step-by-step guides for buying, selling, and renting properties. Learn how to find the right property, negotiate deals, and navigate the entire process with confidence." />

    <MoleculesGuideGrid>
      <MoleculesGuideCard 
      v-for="category in categories" 
      :key="category._id" 
      :title="category.title" 
      :description="category.description" 
      :to="`/guides/${category.slug.current}`"
      :image="category.heroImage" />
    </MoleculesGuideGrid>

    <section v-if="!isWaitingListMode">
      <div class="guides-home__advert">
        <MoleculesListingAdvert />
      </div>
    </section>

    <section v-if="!isWaitingListMode">
      <OrganismsRelevantListings type="trending" title="Trending" :days="7" :limit="10" />
    </section>
  </div>
</template>

<script setup lang="ts">

const { isWaitingListMode} = useWaitingListMode()

const { data: categories } = await useSanityQuery<GuideCategory[]>(categoriesQuery)

const breadcrumbItems = computed(() => [{ label: "Guides", to: "/guides" }]);

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
