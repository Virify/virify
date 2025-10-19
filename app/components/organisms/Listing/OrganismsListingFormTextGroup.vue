<template>
  <div class="o-form-group" :class="{ 'o-form-group--grid': grid}">
    <AtomsDivider v-if="divider" />
    <MoleculesListingFormHeading :title="title" :description="description" :required="required" :tooltip="tooltip" :hasTooltip="!!tooltip || !!$slots['tooltip-content']">
      <template v-if="$slots.description" #description>
        <slot name="description" />
      </template>
      <template #tooltip-content>
        <slot name="tooltip-content">
          <p class="body-xs">{{ tooltip }}</p>
        </slot>
      </template>
    </MoleculesListingFormHeading>
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
  description?: string;
  modelValue: any;
  name: string;
  placeholder?: string;
  required?: boolean;
  divider?: boolean;
  grid?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: any];
}>();
</script>

<style lang="scss">
.o-form-group { 

  &__input {
    margin: 0 auto;
    width:100%;
    max-width: 800px;
  }

  /* gridmodifier overrides without !important */
  &--grid{
    padding: var(--size-8) 0 !important;
    
    .o-form-group {
      &__title {
        text-align: left;
      }

      &__input {
        max-width: none;
      }
    }
  }
}
</style>