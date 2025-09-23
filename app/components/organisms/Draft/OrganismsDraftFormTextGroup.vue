<template>
  <div class="o-form-group">
    <AtomsDivider v-if="divider" />
    <p class="o-form-group__title | body-sm">{{ title }}</p>
    <div class="o-form-group__input">
      <AtomsInput
        :name="name" 
        :modelValue="modelValue" 
        :required="required"
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

  &__input {
    margin: 0 auto;
    width:100%;
    max-width: 800px;
  }
}
</style>