<template>
  <div class="o-form-group">
    <AtomsDivider v-if="divider" />
    <p class="o-form-group__title | body-sm">{{ title }}</p>
    <label class="o-form-group__label | body-sm">
      <AtomsSelect 
        :modelValue="modelValue"
        :options="yearBuiltOptions"
        class="o-form-group__select | body-sm"
        :placeholder="'Select Year Built'"
        :label="'What year was the property built?'"
        name="year-built"
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
}

defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: any];
}>();
</script>

<style lang="scss">
.o-form-group {
  &__title {
    text-align: center;
    padding-bottom: var(--size-16);
  }

  &__label {
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }

  &__select {
    min-width: 150px;
    margin: 0 auto;
    border: 1px solid var(--secondary-400);
  }
}
</style>