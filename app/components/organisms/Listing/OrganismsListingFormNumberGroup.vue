<template>
  <div class="o-form-group" :class="{ 'o-form-group--grid': grid, 'o-form-group--disabled': disabled }">
    <AtomsDivider v-if="divider" />
    <MoleculesListingFormHeading :title="title" :description="description" :required="required" :tooltip="tooltip" :hasTooltip="!!tooltip || !!$slots['tooltip-content']">
      <template v-if="$slots.description" #description>
        <slot name="description" />
      </template>
      <template #tooltip-content>
        <slot name="tooltip-content">
          <p class="body-sm">{{ tooltip }}</p>
        </slot>
      </template>
    </MoleculesListingFormHeading>
  <em v-if="info" class="o-form-group__info | body-sm">{{ info }}</em>
    <div class="o-form-group__number-input">
      <AtomsInput
        type="number"
        :min="min"
        :max="max"
        :step="step"
        inputmode="decimal"
        :name="name"
        :modelValue="modelValue ?? undefined"
        :placeholder="placeholder || 'Enter ' + title.toLowerCase()"
        :required="required"
        :disabled="disabled"
        class="body-sm"
        @update:modelValue="handleUpdateModel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  title: string;
  description?: string;
  info?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  divider?: boolean;
  placeholder?: string;
  modelValue: number | null;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  grid?: boolean;
  tooltip?: string;
}

defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

function handleUpdateModel(val: any) {
  // Handle empty string or null/undefined as null, but allow 0
  emit('update:modelValue', val === '' || val === null || val === undefined ? null : parseFloat(val))
}


</script>

<style lang="scss">
.o-form-group {
  padding: var(--size-32) 0;

  &__info {
    display: block;
    text-align: center;
    margin-top: -8px;
    margin-bottom: var(--size-12);
    color: light-dark(var(--blue-500), var(--blue-600));
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

  /* disabled modifier */
  &--disabled {
    opacity: 0.6;
    
    .o-form-group__title {
      color: var(--text-muted);
    }
    
    .o-form-group__info {
      color: var(--blue-400);
      font-weight: 500;
    }
  }
}
</style>