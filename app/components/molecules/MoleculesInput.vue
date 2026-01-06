<template>
  <div class="m-input">
    <AtomsInput v-bind="$attrs" :model-value="modelValue" class="m-input__text" />
    <AtomsIcon v-if="icon" :icon="icon" :title="iconTitle" class="m-input__icon--search" />
    <AtomsIcon v-if="deleteble && modelValue" icon="cross" title="Clear input" class="m-input__icon--remove"
      @click="$emit('update:model-value', '')" />
  </div>
</template>
<script lang="ts" setup>

interface Props {
  modelValue: string;
  iconTitle?: string;
  icon?: string;
  deleteble?: boolean;
}

defineProps<Props>();
</script>
<style lang="scss" scoped>
.m-input {
  position: relative;

  :deep(.m-input__text) {
    padding-left: var(--size-40);
  }

  &__icon {

    &--search {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      padding-left: var(--size-12);
      pointer-events: none;
    }

    &--remove {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      padding-right: var(--size-12);
      cursor: pointer;
    }
  }
}
</style>