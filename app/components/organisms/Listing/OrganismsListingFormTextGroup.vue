<template>
  <div class="o-form-group" :class="{ 'o-form-group--grid': grid}">
    <AtomsDivider v-if="divider" />
    <MoleculesListingFormHeading :title="title" :description="description" :required="required" :tooltip="tooltip" :hasTooltip="!!tooltip || !!$slots['tooltip-content']">
      <template #description>
        <slot name="description" />
      </template>
      <template #tooltip-content>
        <slot name="tooltip-content">
          <p class="body-sm">{{ tooltip }}</p>
        </slot>
      </template>
    </MoleculesListingFormHeading>
  <em v-if="info" class="o-form-group__info | body-sm">{{ info }}</em>
    <div class="o-form-group__input">
      <template v-if="multiline">
        <textarea
          :name="name"
          :placeholder="placeholder || 'Enter ' + title.toLowerCase()"
          :disabled="disabled"
          class="body-sm o-form-group__textarea"
          @input="handleTextareaInput"
        >{{ modelValue || '' }}</textarea>
      </template>
      <template v-else>
        <AtomsInput
          :name="name" 
          :modelValue="modelValue" 
          :required="required"
          :disabled="disabled"
          :placeholder="placeholder || 'Enter ' + title.toLowerCase()"
          class="body-sm"
          @update:modelValue="$emit('update:modelValue', $event)" 
        />
      </template>
    </div>
      
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  info?: string;
  modelValue: any;
  name: string;
  placeholder?: string;
  required?: boolean;
  divider?: boolean;
  grid?: boolean;
  disabled?: boolean;
  tooltip?: string;
  multiline?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

function handleTextareaInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}
</script>

<style lang="scss">
.o-form-group { 

  &__input {
    margin: 0 auto;
    width:100%;
    max-width: 800px;
  }

  &__textarea {
    border: 1px solid var(--input-text-border);
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