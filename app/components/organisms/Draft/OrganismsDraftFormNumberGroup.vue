<template>
  <div class="o-form-group">
    <AtomsDivider v-if="divider" />
    <p class="o-form-group__title | body-sm">{{ title }}
      <span v-if="required" class="o-form-group__required | title-xs">*</span>
    </p>
    <div class="o-form-group__number">
      <AtomsInput
        type="number"
        min="0"
        max="100"
        :name="name"
        :modelValue="modelValue"
        :placeholder="placeholder || 'Enter a number'"
        :required="required"
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
  placeholder?: string
  modelValue: any;
}

defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

function handleUpdateModel(val: any) {
  emit('update:modelValue', val ? parseInt(val) : null)
}

</script>

<style lang="scss">
.o-form-group {

  &__title {
    text-align: center;
    padding-bottom: var(--size-16);
  }

  &__number {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>