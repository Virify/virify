<template>
  <div class="guides-home | container">
    <MoleculesBreadcrumb :items="breadcrumbItems" />

    <AtomsGuideHero title="Virify Guides" description="From your very first step to your biggest leap, our guides help keep your marketing moving in the right direction." />

    <MoleculesGuideGrid>
      <MoleculesGuideCard
        v-for="category in categories"
        :key="category._id"
        :title="category.title"
        :description="category.description"
        :to="`/guides/${category.slug.current}`"
        :icon="category.icon || 'content/info'" />
    </MoleculesGuideGrid>

    <section>
      <div class="guides-home__advert">
        <AtomsDivider />
        <MoleculesListingAdvert />
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
// Guides homepage
const { useCategories } = useSanity();

const { data: categories } = await useCategories();

const breadcrumbItems = computed(() => [{ label: "Guides", to: "/guides" }]);
</script>

<style scoped lang="scss">
.guides-home {
  padding-bottom: var(--size-32);

  &__categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--size-24);
    margin-top: var(--size-32);

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
  }

  &__advert {
    padding: var(--size-32) 0;
    display: flex;
    justify-content: center;
  }
}
</style>
