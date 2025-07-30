<template>
  <div class="stat-card">
    <header class="stat-card__header">
      <div class="stat-card__title-row">
        <h4 class="stat-card__title | title-xs">{{ title }}</h4>
      </div>
      <AtomsPill class="pill | body-xs">{{ value }}</AtomsPill>
    </header>
    <div v-if="description" class="stat-card__desc-row">
      <button v-if="info" class="stat-card__info-btn button button-xs button-quiet" type="button" aria-label="Show info about this statistic" @click="toggleInfoModal">
        <AtomsIcon icon="property/info" :size="16" />
      </button>
      <p class="stat-card__description | body-sm">{{ description }}</p>
    </div>

    <!-- Info Modal -->
    <Teleport to="body">
      <div v-if="showInfoModal">
        <div class="stat-card-info-modal" @click.stop :style="modalPosition">
          <div class="stat-card-info-modal__header">
            <span></span>
            <button @click="closeInfoModal" class="stat-card__info-btn button button-xs button-quiet" type="button" aria-label="Close info">
              <AtomsIcon icon="cross" :size="16" />
            </button>
          </div>
          <p class="| body-sm">{{ info }}</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  description?: string;
  info?: string;
}

defineProps<Props>();

const showInfoModal = ref(false);
const modalPosition = ref({});
const modalRef = ref<HTMLElement | null>(null);

function lockBodyScroll() {
  document.body.style.overflow = "hidden";
}

function unlockBodyScroll() {
  document.body.style.overflow = "";
}

function toggleInfoModal(event: MouseEvent) {
  if (showInfoModal.value) {
    closeInfoModal();
  } else {
    // Position modal near the button
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    modalPosition.value = {
      position: "fixed",
      top: `${rect.bottom + 8}px`,
      left: `${rect.left - 40}px`,
      zIndex: 2000,
    };
    showInfoModal.value = true;
    lockBodyScroll();
    // Wait for next tick to set ref
    setTimeout(() => {
      modalRef.value = document.querySelector(".stat-card-info-modal");
    }, 0);
  }
}

function closeInfoModal() {
  showInfoModal.value = false;
  modalPosition.value = {};
  unlockBodyScroll();
}

function handleDocumentClick(event: MouseEvent) {
  if (!showInfoModal.value) return;
  const modalEl = modalRef.value;
  if (modalEl && !modalEl.contains(event.target as Node)) {
    closeInfoModal();
  }
}
</script>

<style lang="scss" scoped>
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
    text-overflow: ellipsis;
    white-space: nowrap;
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

/* Modal styles */
.stat-card-info-modal {
  background: var(--background-100);
  border: 1px solid var(--monochrome-600);
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  max-width: 350px;
  padding: var(--size-16);
  position: fixed;
  z-index: 2000;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-end;
    margin-bottom: var(--size-8);
  }
}
</style>
