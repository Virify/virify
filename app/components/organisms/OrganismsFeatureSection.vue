<template>
  <section class="o-feature-section" :class="sectionClasses">
    <div class="container">
      <div class="o-feature-section__wrapper">
        <!-- Image Column -->
        <div class="o-feature-section__image-container" :class="imageContainerClasses">
          <!-- Single Image - Cloudflare -->
          <div v-if="!overlaidImages && !overlaidSanityImages && image" class="o-feature-section__image">
            <AtomsCloudFlareImage 
              :src="image" 
              :variant="imageVariant"
              :alt="imageAlt || ''"
              :placeholder="true"
            />
          </div>

          <!-- Single Image - Sanity -->
          <div v-else-if="!overlaidImages && !overlaidSanityImages && sanityImage?.asset" class="o-feature-section__image">
            <NuxtImg
              provider="sanity"
              :src="sanityImage.asset._id || sanityImage.asset._ref || sanityImage.asset.url"
              :alt="sanityImage.alt || imageAlt || ''"
              loading="lazy"
              :placeholder="'/img/preload.svg'"
            />
          </div>

          <!-- Overlaid Images - Cloudflare -->
          <div v-else-if="overlaidImages?.rear && overlaidImages?.front && !overlaidSanityImages" class="o-feature-section__images-overlaid">
            <div class="o-feature-section__image-rear">
              <AtomsCloudFlareImage 
                :src="overlaidImages.rear" 
                :variant="imageVariant"
                :alt="overlaidImages.rearAlt || ''"
                :placeholder="true"
              />
            </div>
            <div class="o-feature-section__image-front">
              <AtomsCloudFlareImage 
                :src="overlaidImages.front" 
                :variant="imageVariant"
                :alt="overlaidImages.frontAlt || ''"
                :placeholder="true"
              />
            </div>
          </div>

          <!-- Overlaid Images - Sanity -->
          <div v-else-if="overlaidSanityImages?.rear?.asset && overlaidSanityImages?.front?.asset" class="o-feature-section__images-overlaid">
            <div class="o-feature-section__image-rear">
              <NuxtImg
                provider="sanity"
                :src="overlaidSanityImages.rear.asset._id || overlaidSanityImages.rear.asset._ref || overlaidSanityImages.rear.asset.url"
                :alt="overlaidSanityImages.rear.alt || ''"
                loading="lazy"
                :placeholder="'/img/preload.svg'"
              />
            </div>
            <div class="o-feature-section__image-front">
              <NuxtImg
                provider="sanity"
                :src="overlaidSanityImages.front.asset._id || overlaidSanityImages.front.asset._ref || overlaidSanityImages.front.asset.url"
                :alt="overlaidSanityImages.front.alt || ''"
                loading="lazy"
                :placeholder="'/img/preload.svg'"
              />
            </div>
          </div>
        </div>

        <!-- Content Column -->
        <div class="o-feature-section__content" :class="contentClasses">
          <h2 class="title-xl">
            <slot name="title">
              {{ title }}
            </slot>
          </h2>
          <p class="body-lg section-subtitle">
            {{ subtitle }}
          </p>

          <ul class="o-feature-section__list">
            <li v-for="(feature, index) in features" :key="index" class="o-feature-section__item">
              <div class="o-feature-section__item-icon">
                <AtomsIcon :icon="feature.icon" :size="24" />
              </div>
              <div class="o-feature-section__item-content">
                <h3 class="title-xs">{{ feature.title }}</h3>
                <p class="body-sm">{{ feature.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Feature {
  icon: string
  title: string
  description: string
}

interface OverlaidImages {
  rear: string
  rearAlt: string
  front: string
  frontAlt: string
}

interface SanityImageAsset {
  _id?: string
  _ref?: string
  url?: string
}

interface SanityImage {
  asset: SanityImageAsset
  alt?: string
}

interface OverlaidSanityImages {
  rear: SanityImage
  front: SanityImage
}

interface Props {
  // Content
  title?: string
  subtitle: string
  features: Feature[]
  
  // Image - Cloudflare
  image?: string
  imageAlt?: string
  imageVariant?: 'public' | 'thumbnail' | 'card' | 'gallery' | 'marker' | 'marketing'
  overlaidImages?: OverlaidImages
  
  // Image - Sanity
  sanityImage?: SanityImage
  overlaidSanityImages?: OverlaidSanityImages
  
  // Layout
  imagePosition?: 'left' | 'right'
  background?: 'white' | 'gradient'
  iconColor?: 'orange' | 'blue'
}

const props = withDefaults(defineProps<Props>(), {
  imagePosition: 'left',
  background: 'white',
  iconColor: 'orange',
  imageVariant: 'marketing',
})

const sectionClasses = computed(() => ({
  'o-feature-section--gradient': props.background === 'gradient',
  'o-feature-section--white': props.background === 'white',
  [`o-feature-section--icon-${props.iconColor}`]: true,
}))

const imageContainerClasses = computed(() => ({
  'o-feature-section__image-container--left': props.imagePosition === 'left',
  'o-feature-section__image-container--right': props.imagePosition === 'right',
}))

const contentClasses = computed(() => ({
  'o-feature-section__content--order-first': props.imagePosition === 'right',
}))
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

.o-feature-section {
  padding: var(--size-120) 0;

  &--white {
    background: var(--background-100);
  }

  &--gradient {
    background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
    color: var(--monochrome-900);
  }

  &__wrapper {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-48);
    align-items: center;

    @include mq.tablet {
      grid-template-columns: 1fr 1fr;
      gap: var(--size-80);
    }

    @include mq.notebook {
      gap: var(--size-120);
    }
  }

  &__image-container {
    @include mq.mobile-only {
      order: 2;
    }

    &--right {
      @include mq.tablet {
        order: 2;
      }
    }
  }

  &__image {
    width: 100%;
    overflow: hidden;
    box-shadow: var(--elevate-200);

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  // Overlaid images styling
  &__images-overlaid {
    position: relative;
    width: 100%;
    min-height: 400px;

    @include mq.mobile-only {
      min-height: 300px;
    }

    @include mq.tablet {
      min-height: 500px;
    }
  }

  &__image-rear {
    position: absolute;
    width: 65%;
    top: 0;
    left: 0;
    overflow: hidden;
    box-shadow: var(--elevate-200);
    z-index: 1;

    @include mq.mobile-only {
      width: 60%;
    }

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  &__image-front {
    position: absolute;
    width: 65%;
    bottom: 0;
    right: 0;
    overflow: hidden;
    box-shadow: var(--elevate-300);
    z-index: 2;

    @include mq.mobile-only {
      width: 60%;
    }

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  &__content {
    @include mq.mobile-only {
      order: 1;
    }

    h2 {
      margin-bottom: var(--size-16);
    }

    .section-subtitle {
      margin-bottom: var(--size-40);
    }
  }

  // Gradient background text color adjustments
  &--gradient &__content {
    .section-subtitle {
      color: var(--monochrome-900);
    }
  }

  // White background text color adjustments
  &--white &__content {
    .section-subtitle {
      color: var(--text-muted);
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-32);
  }

  &__item {
    display: flex;
    gap: var(--size-16);
    align-items: flex-start;
  }

  &__item-icon {
    flex-shrink: 0;
    width: var(--size-48);
    height: var(--size-48);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-md);
  }

  // Orange icons (default)
  &--icon-orange &__item-icon {
    background: fn.faded-color(10%, var(--secondary-400));
    color: var(--secondary-400);
  }

  // Orange icons on gradient background
  &--gradient.--icon-orange &__item-icon {
    background: fn.faded-color(20%, var(--secondary-400));
    color: var(--secondary-400);
  }

  // Blue icons
  &--icon-blue &__item-icon {
    background: fn.faded-color(10%, var(--blue-400));
    color: var(--blue-400);
  }

  &__item-content {
    flex: 1;

    h3 {
      margin: 0 0 var(--size-8) 0;
    }

    p {
      margin: 0;
    }
  }

  // Text colors for white background
  &--white &__item-content {
    h3 {
      color: var(--secondary-400);
    }

    p {
      color: var(--text-muted);
    }
  }

  // Text colors for gradient background
  &--gradient &__item-content {
    h3 {
      color: var(--monochrome-900);
    }

    p {
      color: fn.faded-color(70%, var(--monochrome-900));
    }
  }
}
</style>
