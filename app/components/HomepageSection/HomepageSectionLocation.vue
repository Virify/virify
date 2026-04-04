<template>
  <div class="homepage-section-location">
    <div class="homepage-section-location__column homepage-section-location__column--sticky">
      <HomepageSectionLocationInfographic />
    </div>

    <HomepageSectionIntro class="homepage-section-location__column" :title="sectionTitle"
      :description="sectionDescription">

      <HomepageSectionList :sections="contentSection" />
    </HomepageSectionIntro>
  </div>
</template>

<script setup lang="ts">

const sectionTitle = 'Super smart location'
const sectionDescription = 'Our intelligent search tools help you keep tabs on your favourite property locations, minus clunky map scrolls or maintaining previous saved search results'

const contentSection = [
  {
    icon: 'map/marker-home',
    title: 'Trending locations',
    content: 'Discover the most popular search areas in real-time. See where others are looking to inform your search and find those hidden gems'
  },
  {
    icon: 'map/marker-home',
    title: 'Saved locations searches',
    content: "Save the locations you're watching and return to them anytime using the Quick Access tool"
  },
  {
    icon: 'map/marker-home',
    title: 'Smart autocomplete',
    content: 'Fast, intuitive location suggestions as you type. Find any city, town, or postcode instantly with intelligent search'
  },
  {
    icon: 'map/marker-home',
    title: 'Search history',
    content: "Review previous searches without having to type them in again with Virify's Quick Access feature"
  },
]
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-location {
  display: grid;
  gap: var(--size-32);
  align-items: center;
  justify-content: center;
  color: var(--monochrome-900);

  @include mq.tablet {
    grid-template-columns: 1fr 1fr;
    gap: var(--size-56);
    align-items: flex-start;
  }

  @include mq.desktop {
    gap: var(--size-72);
  }

  &__column--sticky {
    overflow: hidden;

    @include mq.tablet {
      position: sticky;
      top: 10ch;
    }
  }
}
</style>