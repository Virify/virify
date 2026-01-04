<template>
  <div class="o-form-group" :class="{ 'o-form-group--grid': grid}">
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
    <label class="o-form-group__label | body-sm">
      <AtomsSelect 
        :modelValue="modelValue"
        :options="options"
        :value="modelValue"
        class="o-form-group__select | body-sm"
        :placeholder="placeholder || 'Select ' + title.toLowerCase()"
        :label="title"
        :name="name"
        :required="required"
        @update:modelValue="$emit('update:modelValue', $event)" />
    </label>
  </div>
</template>

<script setup lang="ts">
interface FormOption {
  value: any;
  key: string;
}

interface Props {
  title: string;
  description?: string;
  options: FormOption[];
  modelValue: any;
  name: string;
  required?: boolean;
  divider?: boolean;
  grid?: boolean;
  placeholder?: string;
  tooltip?: string;
}

const props = defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: any];
}>();
</script>

<style lang="scss">
.o-form-group {
  padding: var(--size-32) 0;

  &__label {
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }

  &__select {
    min-width: 200px;
    margin: 0 auto;
    border: 1px solid var(--input-text-border);
    padding: var(--size-10);
    --secondary-400: var(--blue-500);
    --select-border-color: var(--blue-400);
    border-color: var(--select-border-color);

    .a-select {
      border-color: transparent;
    }

    .a-select:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(var(--blue-500-rgb, 59,130,246), 0.12);
    }
  }

  /* grid modifier overrides without !important */
  &--grid {
    padding: var(--size-8) 0 !important;
    
    .o-form-group {
      &__title {
        text-align: left;
      }

      &__label {
        justify-content: flex-start;
      }

      &__select {
        min-width: none;
        width: 100%;
        border-color: var(--select-border-color);
      }
    }
  }

  /* Dark theme adjustments: swap to the alternate blue token per design */
  html.dark & {
    .o-form-group__select {
      --secondary-400: var(--blue-400);
      --select-border-color: var(--blue-500);
      border-color: var(--select-border-color);
    }
  }
}
</style>