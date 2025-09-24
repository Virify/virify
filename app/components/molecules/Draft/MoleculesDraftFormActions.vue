<template>
  <div class="step__form-actions" :class="{ 'with-previous': showPrevious }">
    <button v-if="showPrevious" class="step__form-action | button button-sm button-secondary" @click.prevent="$emit('previous')" type="button">
      Previous Step
    </button>

    <div class="step__form-actions--right">
      <button v-if="hasChanges" class="step__form-action | button button-sm button-secondary" @click.prevent="$emit('cancel')" type="button">
        Cancel
      </button>

      <button class="step__form-action | button button-sm button-secondary" :disabled="buttonDisabled" @click.prevent="$emit('submit')" :type="submitType">
        {{ primaryText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  hasChanges?: boolean;
  buttonDisabled?: boolean;
  primaryText?: string;
  showPrevious?: boolean;
  submitType?: 'button' | 'submit';
}>();

defineEmits<{
  cancel: [];
  previous: [];
  submit: [];
}>();

const hasChanges = computed(() => Boolean(props.hasChanges));
const buttonDisabled = computed(() => Boolean(props.buttonDisabled));
const primaryText = computed(() => props.primaryText ?? 'Save and Continue');
const showPrevious = computed(() => Boolean(props.showPrevious));
const submitType = computed(() => props.submitType ?? 'submit');
</script>

<style scoped lang="scss">
.step__form-actions {
  display: flex;
  margin-top: var(--size-24);
  gap: var(--size-16);

  &.with-previous {
    justify-content: space-between;
  }

  /* when there's no previous button, right-align the actions */
  &:not(.with-previous) {
    justify-content: flex-end;
  }

  &--right {
    display: flex;
    gap: var(--size-16);
    align-items: center;
  }
}
</style>
