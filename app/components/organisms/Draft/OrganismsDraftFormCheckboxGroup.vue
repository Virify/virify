<template>
  <div class="o-form-group">
    <AtomsDivider v-if="divider" />
    <MoleculesDraftFormHeading :title="title" :required="required" :tooltip="tooltip" :hasTooltip="!!tooltip || !!$slots['tooltip-content']">
      <template #tooltip-content>
        <slot name="tooltip-content">
          <p v-if="tooltip" class="body-xs">{{ tooltip }}</p>
        </slot>
      </template>
    </MoleculesDraftFormHeading>
    <ul class="o-form-group__list">
      <li v-for="option in options" :key="option.value" class="o-form-group__item">
        <label class="o-form-group__label | body-sm">
            <AtomsPill class="o-form-group__checkbox"
              :class="{ 'o-form-group__checkbox--selected': isSelected(option.value) }">
              <input 
                type="checkbox" 
                :name="name" 
                :value="option.value"
                :checked="isSelected(option.value)" 
                class="o-form-group__input | visually-hidden"
                @change="handleChange(option.value)" 
              />
              {{ option.key }}
            </AtomsPill>
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface FormOption {
  value: string;
  key: string;
  info: string;
}

interface Props {
  title: string;
  options: FormOption[];
  modelValue: string[];
  name: string;
  required?: boolean;
  divider?: boolean;
  tooltip?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

function isSelected(value: string): boolean {
  return props.modelValue.includes(value);
}

function handleChange(value: string) {
  const currentValue = [...props.modelValue];
  const index = currentValue.indexOf(value);
  
  if (index > -1) {
    // Remove if already selected
    currentValue.splice(index, 1);
  } else {
    // Add if not selected
    currentValue.push(value);
  }
  
  emit('update:modelValue', currentValue);
}
</script>

<style lang="scss">
.o-form-group {
  padding: var(--size-32) 0;
  &__list {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    justify-items: center;
    gap: var(--size-16);
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
  }
  
  &__required {
    color: var(--error);
    margin-left: var(--size-4);
    top: -20px;
  }

  &__checkbox {
    background: var(--background-200);
    border: 1px solid var(--secondary-400);
    cursor: pointer;

    &--selected {
      background: var(--secondary-400);
      color: var(--monochrome-900);
    }
  }
}
</style>