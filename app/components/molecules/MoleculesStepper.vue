<template>
  <div class="stepper">
    <div class="stepper__track">
      <div class="stepper__connector"></div>
      <div class="stepper__steps">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
// No props needed, just slots
</script>

<style scoped lang="scss">
@use '#styles/_utils/media' as mq;

.stepper {
  display: flex;
  justify-content: center;
  align-items: flex-start;

  &__track {
    position: relative;
    width: 100%;
  }

  &__connector {
    position: absolute;
    top: 24px;
    left: calc(-50vw + 50%);
    right: calc(-50vw + 50%);
    height: 4px;
    background: linear-gradient(90deg, var(--blue-400), var(--primary-400));
    z-index: 1;
    border-radius: 2px;
  }

  &__steps {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    position: relative;
    z-index: 2;
    width: 100%;
  }
}

@media (max-width: 900px) {
  .stepper {
    &__steps {
      flex-direction: column;
      align-items: stretch;
      gap: var(--size-40);
      position: relative;
    }

    &__connector {
      top: 12px;
      left: 28px;
      width: 4px;
      height: calc(100% - 90px);
      background: linear-gradient(180deg, var(--blue-400), var(--primary-400));
      z-index: 0;
    }
  }
}
</style>