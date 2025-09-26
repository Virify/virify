<template>
  <div class="o-form-group" :class="{ 'o-form-group--grid': grid}">
    <AtomsDivider v-if="divider" />
    <p class="o-form-group__title | body-sm">{{ title }}
      <span v-if="required" class="o-form-group__required | title-xs">*</span>
    </p>
    <div class="o-form-group__number-input">
      <AtomsInput
        type="number"
        :min="min"
        :max="max"
        :step="step"
        inputmode="decimal"
        :name="name"
        :modelValue="modelValue || undefined"
        :placeholder="placeholder || 'Enter ' + title.toLowerCase()"
        :required="required"
        class="body-sm"
        @update:modelValue="handleUpdateModel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  title: string;
  name?: string;
  required?: boolean;
  divider?: boolean;
  placeholder?: string;
  modelValue: number | null;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  grid?: boolean;
}

defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

function handleUpdateModel(val: any) {
  emit('update:modelValue', val ? parseFloat(val) : null)
}


</script>

<style lang="scss">
.o-form-group {
  padding: var(--size-32) 0;
  &__title {
    text-align: center;
    padding-bottom: var(--size-16);
  }

  &__required {
    color: var(--error);
    margin-left: var(--size-4);
    top: -20px;
  }

  &__number-input {
    margin: 0 auto;
    width:100%;
    max-width: 250px;
  }

  /* grid modifier overrides without !important */
  &--grid {
    padding: var(--size-8) 0 !important;
    
    .o-form-group {
      &__title {
        text-align: left;
      }

      &__number-input {
        max-width: none;
      }
    }
  }
}
</style>