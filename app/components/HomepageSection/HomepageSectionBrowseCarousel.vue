<template>
  <div
    role="presentation"
    v-if="results.length"
  >
    <h2
      class="homepage-section-browse-carousel__title | text-3xl sm:text-4xl lg:text-5xl text-pretty tracking-tight font-bold text-highlighted text-center"
    >
      {{ title }}
    </h2>

    <MoleculesCarousel
      :slides="formattedResults"
      slide-size="min(360px, 100%)"
      gap="var(--size-16)"
      show-arrows
      :options="{
        dragFree: false,
        watchDrag: false,
      }"
      class="homepage-section-browse-carousel__carousel"
    >
      <template #default="{ slide }">
        <PropertyCardSkeleton v-if="slide.isPending" />

        <PropertyCardRoot
          v-else
          v-bind="slide"
        />
      </template>
    </MoleculesCarousel>

    <nuxt-link
      to="/browse/"
      class="homepage-section-browse-carousel__view-more | button"
      >Browse all properties

      <AtomsIcon icon="arrow-right" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title?: string;
  }
  withDefaults(defineProps<Props>(), {
    title: "Featured properties",
  });

  const { results, isPending } = useViewAllListings({
    limit: 10,
  });

  const formattedResults = computed(() => {
    // Show pending state whilst loading
    if (isPending.value) {
      return Array.from({ length: 10 }).map(() => ({
        isPending: true,
      }));
    }

    // If no results, return an empty array
    if (!Array.isArray(results.value)) return [];

    // Otherwise return properties in correct format
    return results.value.map(mapToCardProps);
  });
</script>

<style lang="scss">
  @use "#styles/_utils/media" as mq;

  .homepage-section-browse-carousel {
    &__title {
      text-align: center;
      margin: 0 auto var(--size-32);
    }

    &__carousel {
      padding: 0 var(--size-32);

      @include mq.tablet {
        padding: 0 var(--size-48);
      }

      & > .embla-prev,
      & > .embla-next {
        background: var(--background-300);
        color: currentColor;
        width: auto;
        height: auto;
        padding: var(--size-4);

        .a-icon {
          width: var(--size-36);
          height: var(--size-36);
        }

        &:hover:not(:disabled) {
          background: var(--background-400);
          color: currentColor;
        }
      }

      & > .embla-prev {
        left: calc(0px - var(--size-14));

        @include mq.tablet {
          left: calc(0px - var(--size-24));
        }
      }

      & > .embla-next {
        right: calc(0px - var(--size-14));

        @include mq.tablet {
          right: calc(0px - var(--size-24));
        }
      }
    }

    &__view-more {
      display: flex;
      width: fit-content;
      color: var(--monochrome-900);
      padding: var(--size-12) var(--size-32);
      margin: var(--size-24) auto;
      text-align: center;

      .a-icon {
        width: var(--size-20);
        height: var(--size-20);
      }
    }
  }
</style>
