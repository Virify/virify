<template>
  <div class="bottom-bar">
    <div class="bottom-bar__section bottom-bar__section--left">
      <AtomsIcon title="Virify Ltd" icon="logo/horizontal-colour" width="222" height="67" class="bottom-bar__logo-image" />
    </div>
    <div class="bottom-bar__section bottom-bar__section--center">
      <h2 class="bottom-bar__title | body-md">{{ title }}</h2>
    </div>
    <div class="bottom-bar__section bottom-bar__section--right">
      <button class="bottom-bar__close" @click="$emit('close')" aria-label="Close">
        <AtomsIcon icon="cross" :size="24" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.bottom-bar {
  position: absolute;
  bottom: var(--size-32);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-2xl);
  border: 1px solid var(--monochrome-600);
  width: 800px;
  max-width: calc(100vw - var(--size-48));
  z-index: 1001;
  padding: var(--size-8) var(--size-18);

  @include mq.mobile-only {
    width: calc(100vw - var(--size-32));
  }

  &__section {
    display: flex;
    align-items: center;

    &--left {
      flex: 0 0 200px; // Fixed width to match logo area
      justify-content: flex-start;
    }

    &--center {
      flex: 1;
      justify-content: center;
      min-width: 0; // Allow text to shrink if needed
    }

    &--right {
      flex: 0 0 200px; // Fixed width to match left section
      justify-content: flex-end;
    }
  }

  &__logo-image {
    height: 32px;
    width: auto;

    @include mq.mobile-only {
      height: 28px;
    }
  }

  &__title {
    color: var(--monochrome-900);
    text-align: center;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;

    @include mq.mobile-only {
      font-size: var(--text-base);
      -webkit-line-clamp: 1;
    }
  }

  &__close {
    background: rgba(0, 0, 0, 0.6);
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.8);
      transform: scale(1.1);
    }

    @include mq.mobile-only {
      width: 40px;
      height: 40px;
    }
  }
}
</style>