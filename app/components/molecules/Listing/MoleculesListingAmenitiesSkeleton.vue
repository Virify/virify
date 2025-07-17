<template>
  <div class="m-listing-amenities-skeleton">
    <div
      v-for="category in skeletonCategories"
      :key="category.name"
      class="m-listing-amenities-skeleton__category"
    >
      <div class="m-listing-amenities-skeleton__category-header">
        <h3 class="m-listing-amenities-skeleton__category-title | title-sm">
          {{ category.name }}
        </h3>
      </div>

      <ul class="m-listing-amenities-skeleton__list | body-md">
        <li
          v-for="item in category.items"
          :key="item.id"
          class="m-listing-amenities-skeleton__item"
        >
          <div class="m-listing-amenities-skeleton__item-icon">
            <AtomsIcon :icon="category.icon" :size="16" />
          </div>
          <div class="m-listing-amenities-skeleton__item-content">
            <span class="m-listing-amenities-skeleton__placeholder-text">
              {{ item.name }}
            </span>
            -
            <span
              class="| font-semibold m-listing-amenities-skeleton__placeholder-text"
            >
              {{ item.distance }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const skeletonCategories = [
  {
    name: "Schools",
    icon: "amenities/school",
    items: [
      { id: 1, name: "Primary School", distance: "0.3 miles" },
      { id: 2, name: "Secondary School", distance: "0.8 miles" },
      { id: 3, name: "College", distance: "1.2 miles" },
    ],
  },
  {
    name: "Hospitals",
    icon: "amenities/hospital",
    items: [
      { id: 4, name: "Medical Centre", distance: "0.5 miles" },
      { id: 5, name: "Hospital", distance: "2.1 miles" },
    ],
  },
  {
    name: "Train Stations",
    icon: "amenities/train",
    items: [
      { id: 6, name: "Station", distance: "0.7 miles" },
      { id: 7, name: "Metro Stop", distance: "1.1 miles" },
    ],
  },
];
</script>

<style lang="scss">
.m-listing-amenities-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  width: 100%;

  &__category {
    &-title {
      margin: 0;
      color: var(--foreground-100);
    }
  }

  &__category-header {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    margin-bottom: var(--size-8);
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    color: var(--foreground-100);
    margin-bottom: var(--size-4);

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--error);
    flex-shrink: 0;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__item-content {
    flex: 1;
  }

  &__placeholder-text {
    background: linear-gradient(
      90deg,
      var(--blue-400) 25%,
      var(--blue-300) 50%,
      var(--blue-400) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
    border-radius: var(--border-radius-sm);
    color: transparent;
    user-select: none;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
