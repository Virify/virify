<template>
  <div
    v-if="floorPlans.length > 0"
    class="p-floorplans"
  >
    <h2 class="title-md">Floor Plans</h2>

    <div class="p-floorplans__grid">
      <button
        v-for="(plan, index) in floorPlansWithSrc"
        :key="`${plan.id || 'plan'}-${index}`"
        type="button"
        class="p-floorplans__card"
        @click="openModal(index)"
      >
        <img
          :src="plan.src"
          :alt="plan.title"
          loading="lazy"
          class="p-floorplans__image"
        />
        <p class="p-floorplans__title body-sm">
          {{ plan.title }}
        </p>
      </button>
    </div>

    <UModal
      v-model:open="isModalOpen"
      fullscreen
      :ui="{ content: 'max-w-none w-full h-full' }"
    >
      <template #content>
        <div class="p-floorplans__modal">
          <div class="p-floorplans__header">
            <h3 class="p-floorplans__modal-title title-md">Floor Plans</h3>
            <button
              type="button"
              class="p-floorplans__close"
              @click="isModalOpen = false"
            >
              <UIcon name="i-lucide-x" />
            </button>
          </div>

          <div class="p-floorplans__active-wrap">
            <img
              v-if="activeFloorPlan"
              :src="activeFloorPlan.src"
              :alt="activeFloorPlan.title"
              class="p-floorplans__active-image"
            />
          </div>

          <div
            v-if="floorPlansWithSrc.length > 1"
            class="p-floorplans__thumbs"
          >
            <button
              v-for="(plan, index) in floorPlansWithSrc"
              :key="`${plan.id || 'thumb'}-${index}`"
              type="button"
              class="p-floorplans__thumb"
              :class="{ 'p-floorplans__thumb--active': index === activeIndex }"
              @click="activeIndex = index"
            >
              <img
                :src="plan.src"
                :alt="plan.title"
                class="p-floorplans__thumb-image"
              />
            </button>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
  interface FloorPlanItem {
    id?: number;
    cloudflareId: string;
    title: string;
  }

  interface Props {
    floorPlans: FloorPlanItem[];
  }

  const props = defineProps<Props>();

  const config = useRuntimeConfig();

  const floorPlansWithSrc = computed(() =>
    props.floorPlans.map((plan) => ({
      ...plan,
      src: `https://imagedelivery.net/${config.public.CF_ACCOUNT_HASH}/${plan.cloudflareId}/public`,
    })),
  );

  const isModalOpen = ref(false);
  const activeIndex = ref(0);

  const activeFloorPlan = computed(() => floorPlansWithSrc.value[activeIndex.value]);

  function openModal(index: number) {
    activeIndex.value = index;
    isModalOpen.value = true;
  }
</script>

<style scoped lang="scss">
  @use "#styles/_utils/media" as mq;

  .p-floorplans {
    &__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--size-16);
      margin-top: var(--size-16);

      @include mq.tablet {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    &__card {
      display: block;
      width: 100%;
      text-align: left;
      border-radius: var(--border-radius-xl);
      overflow: hidden;
      background: var(--background-100);
      border: 1px solid var(--border-color, var(--background-300));
      color: inherit;
      transition:
        border-color var(--animation-fast),
        transform var(--animation-fast);

      &:hover {
        border-color: var(--color-secondary-500, var(--color-secondary));
        transform: translateY(-1px);
      }
    }

    &__image {
      width: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      display: block;
      background: var(--background-200);
    }

    &__title {
      margin: 0;
      padding: var(--size-12) var(--size-14);
      font-weight: var(--font-weight-medium, 500);
    }

    &__modal {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
      background: color-mix(in srgb, var(--background-100) 94%, black 6%);
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: var(--size-16);
      padding: var(--size-16);
      position: relative;
    }

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--size-12);
    }

    &__modal-title {
      margin: 0;
    }

    &__active-wrap {
      min-height: 0;
      display: grid;
      place-items: center;
      overflow: hidden;
    }

    &__active-image {
      width: min(1800px, 96vw);
      max-width: 100%;
      max-height: calc(100dvh - 8rem);
      height: auto;
      object-fit: contain;
      border-radius: var(--border-radius-lg);
      background: var(--background-200);
    }

    &__thumbs {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(5rem, 8rem);
      gap: var(--size-10);
      overflow-x: auto;
      padding-bottom: var(--size-4);
    }

    &__thumb {
      border: 1px solid var(--background-300);
      border-radius: var(--border-radius-md);
      overflow: hidden;
      opacity: 0.8;

      &--active {
        border-color: var(--color-secondary-500, var(--color-secondary));
        opacity: 1;
      }
    }

    &__thumb-image {
      width: 100%;
      height: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      display: block;
    }

    &__close {
      position: static;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 999px;
      border: 1px solid var(--background-300);
      background: color-mix(in srgb, var(--background-100) 88%, black 12%);
      display: grid;
      place-items: center;
    }
  }
</style>
