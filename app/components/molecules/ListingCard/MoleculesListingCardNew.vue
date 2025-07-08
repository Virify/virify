<template>
  <div class="m-listing-card" :data-tier="listing_tier === 'FEATURED' ? 'featured' : null">
    <div v-if="listing_tier === 'FEATURED'" class="m-listing-card-featured-banner | body-sm font-bold">
      Featured
    </div>
    <div ref="emblaNode" class="m-listing-card-image-container">
      <div class="m-listing-card-image-slides">
        <div v-for="(img, index) in images" :key="index" class="m-listing-card-image-slide">
          <nuxt-img :src="img" alt="Listing image" class="m-listing-card-image" />
        </div>
      </div>
      <div class="m-listing-card-image-overlay">
        <div class="m-listing-card-image-counter | body-xs">
          {{ selectedIndex + 1 }}/{{ images.length }}
        </div>
        <div class="m-listing-card-image-actions">
          <button class="m-listing-card-icon-button">
            <AtomsIcon name="heart" icon="cards/favourite" />
          </button>
          <button class="m-listing-card-icon-button">
            <AtomsIcon name="edit" icon="cards/notes" />
          </button>
        </div>
        <button class="m-listing-card-arrow-button m-listing-card-arrow-button--left" @click="scrollPrev">
          <AtomsIcon name="chevron-left" icon="chevron-left" />
        </button>
        <button class="m-listing-card-arrow-button m-listing-card-arrow-button--right" @click="scrollNext">
          <AtomsIcon name="chevron-right" icon="chevron-right" />
        </button>
      </div>
    </div>
    <div class="m-listing-card-content">
      <div class="m-listing-card-details">
        <div class="m-listing-card-header">
          <p class="m-listing-card-price | title-sm">
            £1,000,000
          </p>
          <p class="m-listing-card-price-qualifier | body-xs font-bold faded-text">
            Guide Price
          </p>
        </div>
        <h3 class="m-listing-card-title | body-md font-semibold">
          Detached House
        </h3>
        <p class="m-listing-card-location | body-xs faded-text">
          Cardiff, CF15
        </p>
        <div class="m-listing-card-features">
          <div class="m-listing-card-feature">
            <AtomsIcon name="bed" icon="property/bedrooms" />
            <span class="body-sm">1</span>
          </div>
          <div class="m-listing-card-feature">
            <AtomsIcon name="bath" icon="property/bathrooms" />
            <span class="body-sm">2</span>
          </div>
          <div class="m-listing-card-feature">
            <AtomsIcon name="ruler" icon="property/receptions" />
            <span class="body-sm">3</span>
          </div>
        </div>
        <div class="m-listing-card-tags">
          <span class="m-listing-card-tag | body-xs">Recently Added</span>
          <span class="m-listing-card-tag | body-xs">Reduced</span>
          <span class="m-listing-card-tag | body-xs">Chain Free</span>
        </div>
      </div>
      <div class="m-listing-card-footer">
        <div class="m-listing-card-agent">
          <div class="m-listing-card-agent-logo">
            <AtomsIcon name="check" icon="tick-solid" />
          </div>
          <p class="body-xs font-semibold">MaggotBalls</p>
        </div>
        <div class="m-listing-card-actions">
          <button class="m-listing-card-button | ghost body-sm font-bold">
            View
          </button>
          <button class="m-listing-card-button | body-sm font-bold">
            Enquire
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import emblaCarouselVue from 'embla-carousel-vue'

const props = defineProps({
  images: {
    type: Array as () => string[],
    default: () => [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ]
  },
  title: {
    type: String,
    default: 'Detached House'
  },
  listing_tier: {
    type: String,
    default: ''
  },
})

const [emblaNode, emblaApi] = emblaCarouselVue({ loop: true, startIndex: Math.floor(Math.random() * props.images.length) })
const selectedIndex = ref(0)

const scrollPrev = () => {
  emblaApi.value?.scrollPrev()
}

const scrollNext = () => {
  emblaApi.value?.scrollNext()
}

const onSelect = () => {
  if (!emblaApi.value) return
  selectedIndex.value = emblaApi.value.selectedScrollSnap()
}

onMounted(() => {
  if (emblaApi.value) {
    emblaApi.value.on('select', onSelect)
    onSelect()
  }
})

watch(emblaApi, (newApi, oldApi) => {
  if (oldApi) {
    oldApi.off('select', onSelect)
  }
  if (newApi) {
    newApi.on('select', onSelect)
    onSelect()
  }
})
</script>

<style lang="scss">
.m-listing-card {
  --card-padding: var(--size-16);
  --image-width: 45%;

  background-color: var(--background-100);
  border: 1px solid var(--foreground-100);
  border-radius: var(--border-radius-2xl);
  display: flex;
  max-width: 960px;
  position: relative;

  &[data-tier='featured'] {
    border-color: var(--secondary-400);
    border-width: var(--size-4);
    padding: 0;

    .m-listing-card-image-container {
      border-radius: var(--border-radius-2xl)
    }

    .m-listing-card-content {
      padding: var(--card-padding);
    }

    .m-listing-card-featured-banner {
      background-color: var(--secondary-400);
      border-radius: calc(var(--border-radius-2xl) - var(--size-4)) 0 var(--border-radius-lg) 0;
      color: var(--monochrome-900);
      padding: var(--size-8) var(--size-24);
      position: absolute;
      top: 0;
      left: -2px;
      z-index: 3;
    }
  }

  .m-listing-card-image-container {
    border-radius: var(--border-radius-2xl);
    overflow: hidden;
    position: relative;
    width: var(--image-width);
    z-index: 1;

    &:hover .m-listing-card-arrow-button {
      opacity: 1;
    }
  }

  .m-listing-card-image-slides {
    display: flex;
    height: 100%;
  }

  .m-listing-card-image-slide {
    flex: 0 0 100%;
    min-width: 0;
    position: relative;
  }

  .m-listing-card-image {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .m-listing-card-image-overlay {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;

    >* {
      transition: opacity 0.2s ease-in-out;
    }
  }

  .m-listing-card-image-counter {
    background-color: var(--secondary-400);
    border-radius: var(--border-radius-xl);
    color: var(--monochrome-900);
    padding: var(--size-4) var(--size-12);
    position: absolute;
    bottom: var(--size-16);
    left: 50%;
    transform: translateX(-50%);
  }

  .m-listing-card-image-actions {
    background-color: var(--secondary-400);
    border-radius: var(--border-radius-pill);
    display: flex;
    gap: var(--size-4);
    padding: var(--size-4) var(--size-8);
    position: absolute;
    top: var(--size-16);
    right: var(--size-16);
  }

  .m-listing-card-icon-button {
    align-items: center;
    background-color: transparent;
    border: none;
    color: var(--monochrome-900);
    cursor: pointer;
    display: flex;
    font-size: var(--font-xl);
    height: var(--size-32);
    justify-content: center;
    width: var(--size-32);
  }

  .m-listing-card-arrow-button {
    align-items: center;
    background-color: var(--secondary-400);
    border: none;
    border-radius: 50%;
    color: var(--monochrome-900);
    cursor: pointer;
    display: flex;
    font-size: var(--font-2xl);
    height: var(--size-40);
    justify-content: center;
    opacity: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: var(--size-40);

    &--left {
      left: var(--size-16);
    }

    &--right {
      right: var(--size-16);
    }
  }

  .m-listing-card-content {
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--card-padding);
    width: calc(100% - var(--image-width));
  }

  .m-listing-card-header {
    align-items: baseline;
    display: flex;
    column-gap: var(--size-8);
    flex-wrap: wrap;
  }

  .m-listing-card-price {
    margin: 0;
  }

  .m-listing-card-price-qualifier {
    margin: 0;
  }

  .m-listing-card-location {
    margin-bottom: var(--size-8);
  }

  .m-listing-card-features {
    display: flex;
    gap: var(--size-8);
    margin-bottom: var(--size-8);
  }

  .m-listing-card-feature {
    align-items: center;
    display: flex;
    font-weight: var(--font-semibold);
    font-size: var(--font-2xl);
    gap: var(--size-1);
    padding: var(--size-4);

    & span {
      margin-left: var(--size-4);
    }
  }

  .m-listing-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);
    margin-bottom: var(--size-8);
  }

  .m-listing-card-tag {
    padding-right: var(--size-8);
    background-color: var(--background-300);
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
  }

  .m-listing-card-footer {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    justify-content: space-between;
  }

  .m-listing-card-agent {
    align-items: center;
    display: flex;
    gap: var(--size-8);
  }

  .m-listing-card-agent-logo {
    align-items: center;
    background-color: var(--secondary-400);
    border-radius: 50%;
    color: var(--monochrome-900);
    display: flex;
    font-size: var(--font-21xl);
    height: var(--size-32);
    justify-content: center;
    width: var(--size-32);
  }

  .m-listing-card-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-8);
    width: 100%;
  }

  .m-listing-card-button {
    background-color: var(--secondary-400);
    border: none;
    border-radius: var(--border-radius-lg);
    color: var(--monochrome-100);
    cursor: pointer;
    padding: var(--size-4);
    width: 100%;

    &.ghost {
      background-color: transparent;
      color: var(--foreground-900);
      border: 1px solid var(--secondary-400);
    }
  }
}

@media (max-width: 1200px) {
  .m-listing-card {
    flex-direction: column;
    max-width: 100%;
    padding: 0;

    .m-listing-card-image-container {
      width: 100%;
      border-radius: var(--border-radius-2xl);
      margin: 0;
      aspect-ratio: 4 / 3;
    }

    &[data-tier='featured'] {
      .m-listing-card-content {
        padding: var(--card-padding);
      }
    }

    .m-listing-card-content {
      width: 100%;
      padding: var(--card-padding);
    }

    .m-listing-card-image-actions {
      top: var(--size-8);
      right: var(--size-8);
    }
  }
}

@media (max-width: 768px) {
  .m-listing-card {
    .m-listing-card-image-container {
      border-radius: var(--border-radius-2xl);
    }

    &[data-tier='featured'] .m-listing-card-image-container {
      width: 100%;
      margin: 0;
    }

    .m-listing-card-content {
      width: 100%;
    }

    .m-listing-card-title {
      font-size: var(--font-lg);
    }

    .m-listing-card-tags {
      display: none;
    }

    .m-listing-card-actions {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>