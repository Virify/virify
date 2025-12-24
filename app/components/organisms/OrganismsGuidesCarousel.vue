<template>
  <MoleculesCarousel v-if="guides && guides.length > 0" :slides="guides" :slide-size="'350px'" :gap="'var(--size-18)'" :loop="false" :show-arrows="true" :button-position="'110%'">
    <template #default="{ slide }">
      <MoleculesGuideCard
        :title="slide.title"
        :to="`/guides/${slide.category?.slug?.current}/${slide.slug.current}`"
        :image="slide.heroImage"
        :excerpt="slide.excerpt"
        :readTime="slide.readTime"
        :updatedAt="slide.updatedAt"
      />
    </template>
  </MoleculesCarousel>
</template>

<script setup lang="ts">
interface Props {
  guides?: Guide[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.guides-carousel {
  &__link {
    text-decoration: none;
    color: inherit;
  }

  &__guide {
    display: flex;
    flex-direction: column;
    height: 100%;

    &--img {
      box-sizing: border-box;
      border-radius: var(--border-radius-2xl);
      overflow: hidden;
      width: 100%;
      height: 200px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    &--category {
      position: absolute;
      top: var(--size-12);
      left: var(--size-12);
    }

    &--read-time {
      position: absolute;
      bottom: var(--size-12);
      right: var(--size-12);
    }

    h2 {
      margin-top: var(--size-16);
      margin-bottom: var(--size-8);
    }

    p {
      margin: 0;
    }
  }
}
</style>
