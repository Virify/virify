<template>
  <div class="homepage-section-map-scroller">
    <HomepageSectionMap class="homepage-section-map-scroller__column homepage-section-map-scroller__column--sticky" />

    <HomepageSectionIntro :title="sectionTitle" :description="sectionDescription">
      <ul class="homepage-section-map-scroller__list">
        <li v-for="{ title, icon, content } of contentSection" :key="title"
          class="homepage-section-map-scroller__list-item">
          <h3 class="homepage-section-map-scroller__list-title | title-md">
            <AtomsIcon v-if="icon" :icon class="homepage-section-map-scroller__list-icon" />
            {{ title }}
          </h3>
          <p class="| body-lg">{{ content }}</p>
        </li>
      </ul>
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
  margin-top: var(--size-120);
  align-items: center;
  justify-content: center;

  @include mq.tablet {
    grid-template-columns: 1fr 1fr;
    gap: var(--size-56);
    align-items: flex-start;
  }

  @include mq.desktop {
    gap: var(--size-72);
  }

  &__list {
    list-style: none;
    margin: var(--size-48) 0;
    padding: 0;
  }

  &__list-item {
    padding: var(--size-24);
    padding-left: var(--size-56);
    max-width: 50ch;
  }

  &__list-icon {
    position: absolute;
    top: calc(50% - var(--size-20));
    left: calc(0px - var(--size-56));
    width: var(--size-40);
    height: var(--size-40);
    color: var(--secondary-400);
  }

  &__list-title {
    position: relative;
    font-size: var(--font-2xl);
    line-height: var(--lineheight-sm);
    margin: 0 0 var(--size-8);

    @include mq.notebook {
      font-size: var(--font-3xl);
    }

    @include mq.desktop {
      font-size: var(--font-4xl);
    }
  }

  &__column--sticky {
    position: sticky;
    top: 0;
  }
}
</style>