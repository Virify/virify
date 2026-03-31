<template>
  <Teleport to="body">
    <div v-if="show">
      <div class="info-modal" @click.stop :style="position">
        <button @click="$emit('close')" class="info-modal__close button button-xs button-quiet" type="button"
          aria-label="Close info">
          <AtomsIcon icon="cross" :size="16" />
        </button>
        <p class="| body-sm">{{ content }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  content: string;
  position: Record<string, any>;
}

defineProps<Props>();
defineEmits<{
  close: [];
}>();
</script>

<style lang="scss" scoped>
.info-modal {
  background: var(--background-200);
  border: 1px solid var(--monochrome-600);
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  max-width: 350px;
  padding: var(--size-16);
  /* position: fixed is set via inline styles from the composable */
  z-index: 2000;

  &__close {
    position: absolute;
    top: var(--size-8);
    right: var(--size-8);
    cursor: pointer;
    color: var(--foreground-200);
    padding: 0;
    background: none;
    border: none;

    &:hover {
      color: var(--foreground-100);
    }

    svg {
      height: 16px;
      width: 16px;
    }
  }

  p {
    margin: 0;
    line-height: 1.4;
  }
}
</style>