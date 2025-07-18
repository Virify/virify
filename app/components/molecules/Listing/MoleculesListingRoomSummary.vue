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
          <p>{{ item.length > 1 ? item.length : null }} {{ item.type }}</p>
          <!-- <p>{{ item.type }}</p> -->
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

        <!-- Multiple rooms - show all stacked -->
        <div v-else class="room-summary-item__details room-summary-item__details--multiple">
          <div
            v-for="(roomData, roomIndex) in item.individualRooms"
            :key="roomIndex"
            class="room-summary-item__room"
            :class="{ 'room-summary-item__room--divider': roomIndex > 0 }"
          >
            <div v-if="item.length > 1" class="room-summary-item__room-number">
              Room {{ roomIndex + 1 }}
            </div>
            <p
              v-for="(detail, detailIndex) in roomData"
              :key="detailIndex"
              class="| body-sm"
            >
              {{ detail }}
            </p>
          </div>
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
    columns: 3;
    column-gap: var(--size-24);
    column-fill: balance;
    
    @media (max-width: 768px) {
      columns: 2;
    }
    
    @media (max-width: 480px) {
      columns: 1;
    }
  }
  &-item {
    display: flex;
    flex-direction: column;
    border-radius: var(--border-radius-2xl);
    overflow: hidden;
    background: var(--monochrome-300);
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    break-inside: avoid;
    margin-bottom: var(--size-24);
    width: 100%;

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
      padding: var(--size-32);
      display: flex;
      height: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--monochrome-900);

      &--multiple {
        gap: var(--size-16);
      }
    }

    &__room {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--size-4);
      width: 100%;

      &--divider {
        border-top: 1px solid var(--monochrome-300);
        padding-top: var(--size-16);
      }
    }

    &__room-number {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--secondary-400);
      margin-bottom: var(--size-8);
    }
  }
}

</style>