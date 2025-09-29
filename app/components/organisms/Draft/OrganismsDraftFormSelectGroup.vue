<template>
  <div class="o-form-group" :class="{ 'o-form-group--grid': grid}">
    <AtomsDivider v-if="divider" />
    <p class="o-form-group__title | body-sm">{{ title }}
      <span v-if="required" class="o-form-group__required | title-xs">*</span>
    </p>
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
  options: FormOption[];
  modelValue: any;
  name: string;
  required?: boolean;
  divider?: boolean;
  grid?: boolean;
  placeholder?: string;
}

defineProps<Props>();
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
      }
    }
  }
}
</style>