<template>
  <div class="homepage-section-map-scroller">
    <HomepageSectionMap class="homepage-section-map-scroller__column homepage-section-map-scroller__column--sticky" />

    <HomepageSectionIntro :title="sectionTitle" :description="sectionDescription">
      <HomepageSectionList :sections="contentSection" />
    </HomepageSectionIntro>
  </div>
</template>

<script setup lang="ts">

const sectionTitle = 'Interactive map experience'
const sectionDescription = 'See neighborhoods at a glance with our information-rich map interface for faster decision-making.'

const contentSection = [
  {
    icon: 'map/marker-home',
    title: 'Photo markers',
    content: 'Our preview feature lets you open photos directly on the map before clicking for the full listing to help you find the right space faster.'
  },
  {
    icon: 'explore/top-picks',
    title: 'Smart clustering',
    content: 'Intelligent clustering keeps the map clean and easy to scan, even with hundreds of properties.'
  },
  {
    icon: 'cards/favourite',
    title: 'Favourites & notes',
    content: 'View your saved properties and notes right on the map with clear visual markers.'
  },
  {
    icon: 'explore/map',
    title: 'Search boundaries',
    content: 'See your search area clearly with live visual radial and boundary overlays. Adjust on the fly to refine results in real time.'
  }
]


</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-map-scroller {
  display: grid;
  gap: var(--size-32);
  align-items: center;
  justify-content: center;

  @include mq.tablet {
    margin-top: var(--size-120);
    grid-template-columns: 1fr 1fr;
    gap: var(--size-56);
    align-items: flex-start;
  }

  @include mq.desktop {
    gap: var(--size-72);
  }

  @include mq.tablet {
    &__column--sticky {
      position: sticky;
      top: 0;
    }
  }
}
</style>