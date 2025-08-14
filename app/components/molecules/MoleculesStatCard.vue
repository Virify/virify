<template>
  <div class="stat-card">
    <header class="stat-card__header">
      <div class="stat-card__title-row">
        <AtomsSkeletonBar :loading="loading" :width="20" :height="20">
          <AtomsIcon v-if="icon" :icon="icon" :size="20" />
        </AtomsSkeletonBar>
        <AtomsSkeletonBar :loading="loading" :width="120" :height="20">
          <h4 class="stat-card__title | title-xs">{{ title }}</h4>
        </AtomsSkeletonBar>
      </div>
      <AtomsSkeletonBar :loading="loading" :width="60" :height="24">
        <AtomsPill class="pill | body-xs">{{ value }}</AtomsPill>
      </AtomsSkeletonBar>
    </header>
    <div v-if="description || loading" class="stat-card__desc-row">
      <AtomsSkeletonBar :loading="loading" :width="16" :height="16">
        <button v-if="info" class="stat-card__info-btn button button-xs button-quiet" type="button" aria-label="Show info about this statistic" @click="openInfoModal">
          <AtomsIcon icon="property/info" :size="16" />
        </button>
      </AtomsSkeletonBar>
      <AtomsSkeletonBar :loading="loading" :width="200" :height="16">
        <p class="stat-card__description | body-sm">{{ description }}</p>
      </AtomsSkeletonBar>
    </div>

    <!-- Info Modal -->
    <AtomsInfoModal 
      :show="showInfoModal" 
      :content="info || ''" 
      :position="modalPosition"
      @close="closeInfoModal"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  description?: string;
  info?: string;
  icon?: string;
  loading?: boolean;
}

defineProps<Props>();

const showInfoModal = ref(false);
const { modalPosition, openModal, closeModal } = useInfoModal(() => {
  showInfoModal.value = false;
});

function openInfoModal(event: MouseEvent) {
  showInfoModal.value = true;
  openModal(event, -40, 8);
}

function closeInfoModal() {
  showInfoModal.value = false;
  closeModal();
}
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;

.stat-card {
  background: var(--background-100);
  border: 1px solid var(--monochrome-600);
  border-radius: var(--border-radius-lg);
  padding: var(--size-16);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;

  &__content {
    width: 100%;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: var(--size-12);
    margin-bottom: var(--size-4);
    position: relative;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    flex: 1;
    min-width: 0;
  }

  &__info-btn {
    cursor: pointer;
    color: var(--foreground-100);
    padding: 0;

    &.button {
      &:hover {
        background: none;
        color: none;
      }
    }

    svg {
      height: 20px;
      width: 20px;
    }
  }

  &__title {
    flex: 1;
    margin: 0;
    min-width: 0;
    overflow: hidden;
  }

  .pill {
    background: var(--blue-400);
  }

  &__desc-row {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    margin-top: var(--size-4);
  }

  &__description {
    color: var(--foreground-200);
    display: block;
    margin: 0;
    flex: 1;
  }
}
</style>
