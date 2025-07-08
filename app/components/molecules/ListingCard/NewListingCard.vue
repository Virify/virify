<template>
  <div class="listing-card" :data-tier="listing_tier === 'FEATURED' ? 'featured' : null">
    <div v-if="listing_tier === 'FEATURED'" class="featured-banner | body-sm font-bold">
      Featured
    </div>
    <div ref="emblaNode" class="image-container">
      <div class="image-slides">
        <div v-for="(img, index) in images" :key="index" class="image-slide">
          <nuxt-img :src="img" alt="Listing image" class="image" />
        </div>
      </div>
      <div class="image-overlay">
        <div class="image-counter | body-xs">
          {{ selectedIndex + 1 }}/{{ images.length }}
        </div>
        <div class="image-actions">
          <button class="icon-button">
            <AtomsIcon name="heart" icon="cards/favourite" />
          </button>
          <button class="icon-button">
            <AtomsIcon name="edit" icon="cards/notes" />
          </button>
        </div>
        <button class="arrow-button arrow-button--left" @click="scrollPrev">
          <AtomsIcon name="chevron-left" icon="chevron-left" />
        </button>
        <button class="arrow-button arrow-button--right" @click="scrollNext">
          <AtomsIcon name="chevron-right" icon="chevron-right" />
        </button>
      </div>
    </div>
    <div class="content">
      <div class="details">
        <div class="header">
          <p class="price | title-sm">
            £1,000,000
          </p>
          <p class="price-qualifier | body-xs font-bold faded-text">
            Guide Price
          </p>
        </div>
        <h3 class="title | body-md font-semibold">
          Detached House
        </h3>
        <p class="location | body-xs faded-text">
          Cardiff, CF15
        </p>
        <div class="features">
          <div class="feature">
            <AtomsIcon name="bed" icon="property/bedrooms" />
            <span class="body-sm">1</span>
          </div>
          <div class="feature">
            <AtomsIcon name="bath" icon="property/bathrooms" />
            <span class="body-sm">2</span>
          </div>
          <div class="feature">
            <AtomsIcon name="ruler" icon="property/receptions" />
            <span class="body-sm">3</span>
          </div>
        </div>
        <div class="tags | box">
          <span class="tag | body-xs">Recently Added</span>
          <span class="tag | body-xs">Reduced</span>
          <span class="tag | body-xs">Chain Free</span>
        </div>
      </div>
      <div class="footer">
        <div class="agent">
          <div class="agent-logo">
            <AtomsIcon name="check" icon="tick-solid" />
          </div>
          <p class="body-xs font-semibold">MaggotBalls</p>
        </div>
        <div class="actions">
          <button class="button | ghost body-sm font-bold">
            View
          </button>
          <button class="button | body-sm font-bold">
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
.listing-card {
  --card-padding: var(--size-16);
  --image-width: 45%;

  background-color: var(--background-100);
  border: var(--size-2) solid var(--foreground-100);
  border-radius: var(--border-radius-2xl);
  display: flex;
  max-width: 960px;
  position: relative;

  &[data-tier='featured'] {
    border-color: var(--secondary-400);
    border-width: var(--size-4);

    .image-container {
      border-radius: calc(var(--border-radius-2xl) - var(--size-4)) 0 0 calc(var(--border-radius-2xl) - var(--size-4));
    }

    .featured-banner {
      background-color: var(--secondary-400);
      border-radius: calc(var(--border-radius-2xl) - var(--size-4)) 0 var(--border-radius-lg) 0;
      color: var(--monochrome-900);
      padding: var(--size-8) var(--size-24);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
  }

  .image-container {
    border-radius: calc(var(--border-radius-2xl) - var(--size-2)) 0 0 calc(var(--border-radius-2xl) - var(--size-2));
    overflow: hidden;
    position: relative;
    width: var(--image-width);

    &:hover .arrow-button {
      opacity: 1;
    }
  }

  .image-slides {
    display: flex;
    height: 100%;
  }

  .image-slide {
    flex: 0 0 100%;
    min-width: 0;
    position: relative;
  }

  .image {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .image-overlay {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;

    > * {
      transition: opacity 0.2s ease-in-out;
    }
  }

  .image-counter {
    background-color: var(--secondary-400);
    border-radius: var(--border-radius-xl);
    color: var(--monochrome-900);
    padding: var(--size-4) var(--size-12);
    position: absolute;
    bottom: var(--size-16);
    left: 50%;
    transform: translateX(-50%);
  }

  .image-actions {
    background-color: var(--secondary-400);
    border-radius: var(--border-radius-pill);
    display: flex;
    gap: var(--size-4);
    padding: var(--size-4) var(--size-8);
    position: absolute;
    top: var(--size-16);
    right: var(--size-16);
  }

  .icon-button {
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

  .arrow-button {
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

  .content {
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--card-padding);
    width: calc(100% - var(--image-width));
  }

  .header {
    align-items: baseline;
    display: flex;
    column-gap: var(--size-8);
    flex-wrap: wrap;
  }

  .price {
    margin: 0;
  }

  .price-qualifier {
    margin: 0;
  }

  .location {
    margin-bottom: var(--size-8);
  }

  .features {
    display: flex;
    gap: var(--size-8);
    margin-bottom: var(--size-8);
  }

  .feature {
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

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-4);
    margin-bottom: var(--size-8);
    background-color: var(--background-300);
    justify-content: space-between;
  }

  .tag {
    padding-right: var(--size-8);
  }

  .footer {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    justify-content: space-between;
  }

  .agent {
    align-items: center;
    display: flex;
    gap: var(--size-8);
  }

  .agent-logo {
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

  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-8);
    width: 100%;
  }

  .button {
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
  .listing-card {
    flex-direction: column;
    max-width: 100%;

    .image-container {
      width: 100%;
      height: 300px;
      border-radius: var(--border-radius-2xl) var(--border-radius-2xl) 0 0;
    }

    &[data-tier='featured'] .image-container {
        border-radius: calc(var(--border-radius-2xl) - var(--size-4)) calc(var(--border-radius-2xl) - var(--size-4)) 0 0;
    }

    .content {
      width: 100%;
    }

    .image-actions {
      top: var(--size-8);
      right: var(--size-8);
    }
  }
}

@media (max-width: 768px) {
  .listing-card {
    flex-direction: column;

    .image-container {
      width: 100%;
      height: 250px;
      border-radius: var(--border-radius-2xl) var(--border-radius-2xl) 0 0;
    }

    &[data-tier='featured'] .image-container {
      border-radius: calc(var(--border-radius-2xl) - var(--size-4)) calc(var(--border-radius-2xl) - var(--size-4)) 0 0;
    }

    .content {
      width: 100%;
    }

    .title {
      font-size: var(--font-lg);
    }

    .tags {
      display: none;
    }

    .actions {
      grid-template-columns: 1fr;
    }
  }
}
</style>