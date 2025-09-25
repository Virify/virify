<template>
  <div class="o-form-group" :class="{ 'o-form-group--expanded': expanded }">
    <AtomsDivider v-if="divider" />
    <p class="o-form-group__title | body-sm">{{ title }}
      <span v-if="required" class="o-form-group__required | title-xs">*</span>
    </p>
    <div class="o-form-group__input">
      <AtomsInput
        :name="name" 
        :modelValue="modelValue" 
        :required="required"
        :disabled="disabled"
        :placeholder="placeholder || 'Enter ' + title.toLowerCase()"
        class="body-sm"
        @update:modelValue="$emit('update:modelValue', $event)" 
      />
    </div>
      
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  modelValue: any;
  name: string;
  placeholder?: string;
  required?: boolean;
  divider?: boolean;
  expanded?: boolean;
  disabled?: boolean;
}

defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: any];
}>();
</script>

<style lang="scss">
.o-form-group { 
  padding: var(--size-32) 0;
  &__title {
    text-align: center;
    padding-bottom: var(--size-16);
  }

  &__input {
    margin: 0 auto;
    width:100%;
    max-width: 800px;
  }

  /* Expanded modifier overrides without !important */
  &--expanded {
    .o-form-group__title {
      text-align: left;
    }

    .o-form-group__input {
      max-width: none;
    }
  }
}
</style>