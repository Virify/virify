<template>
  <div class="room-summary">
    <h2 class="room-summary__title | title-md">{{ title }}</h2>
    <ul class="room-summary__items">
      <li
        v-for="(item, index) in rooms"
        :key="index"
        class="room-summary-item"
      >
        <div class="room-summary-item__title | title-md">
          <p>{{ item.length || 1 }}</p>
          <p>{{ item.type }}</p>
        </div>

        <!-- Single room - show normally -->
        <div
          v-if="item.length <= 1"
          class="room-summary-item__details"
        >
          <p
            v-for="(detail, detailIndex) in item.data"
            :key="detailIndex"
            class="| body-sm"
          >
            {{ detail }}
          </p>
        </div>

        <!-- Multiple rooms - show as carousel -->
        <div v-else class="room-summary-item__details">
          <MoleculesCarousel
            :ref="(el) => setCarouselRef(el, index)"
            :slides="item.individualRooms"
            class="room-carousel-container"
          >
            <template #default="{ slide }">
              <p
                v-for="(detail, detailIndex) in slide"
                :key="detailIndex"
                class="| body-sm"
              >
                {{ detail }}
              </p>
            </template>
          </MoleculesCarousel>

          <!-- Navigation arrows -->
          <button
            class="room-carousel-arrow room-carousel-arrow--prev"
            @click="scrollPrev(index)"
          >
            <AtomsChevron height="30" width="30" />
          </button>
          <button
            class="room-carousel-arrow room-carousel-arrow--next"
            @click="scrollNext(index)"
          >
            <AtomsChevron height="30" width="30" />
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

interface RoomConfig {
  type: string;
  features: any[] | any;
  excludedKeys?: string[];
}

interface Props {
  roomConfigs: RoomConfig[];
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Rooms'
});

const carouselRefs = ref<any[]>([]);

const setCarouselRef = (el: any, index: number) => {
  if (el) {
    carouselRefs.value[index] = el;
  }
};

const scrollPrev = (index: number) => {
  const carousel = carouselRefs.value[index];
  if (carousel) {
    carousel.scrollPrev();
  }
};

const scrollNext = (index: number) => {
  const carousel = carouselRefs.value[index];
  if (carousel) {
    carousel.scrollNext();
  }
};

const rooms = computed(() => {
  return props.roomConfigs.map((config) => {
    const features = Array.isArray(config.features) ? config.features : [config.features].filter(Boolean);
    
    return {
      length: Array.isArray(config.features) ? config.features.length : 1,
      type: config.type,
      data: extractFeatures(features, config.excludedKeys),
      individualRooms: Array.isArray(config.features) 
        ? config.features.map((feature) => extractFeatures([feature], config.excludedKeys))
        : [],
    };
  });
});
</script>

<style lang="scss">
.room-summary {
  padding: var(--size-16);
  &__items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--size-24);
  }
  &-item {
    display: flex;
    flex-direction: column;
    border-radius: var(--border-radius-2xl);
    overflow: hidden;
    background: var(--blue-400);
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
    }

    &__title {
      width: 100%;
      padding: var(--size-24) 0;
      background: url("/img/logo-background.svg") no-repeat center right,
        var(--secondary-400);
      background-size: auto 250%, cover;
      color: var(--foreground-100);
      text-transform: capitalize;
      margin: 0;
    }

    &__details {
      position: relative;
      display: flex;
      height: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--size-24) var(--size-16);
      color: var(--monochrome-900);
    }
  }
}

.room-carousel-container {
  position: relative;
}

.room-carousel-arrow {
  position: absolute;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: var(--secondary-400);

  &--prev {
    left: 8px;
    transform: translateY(-50%) rotate(90deg);
  }

  &--next {
    right: 8px;
    transform: translateY(-50%) rotate(-90deg);
  }
}
</style>