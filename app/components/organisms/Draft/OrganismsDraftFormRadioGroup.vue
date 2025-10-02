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
        <label class="o-form-group__label | body-sm" @click.prevent="handleClick(option.value)">
          
            <AtomsPill class="o-form-group__radio"
              :class="{ 'o-form-group__radio--selected': modelValue === option.value }">
              <input 
                type="radio" 
                :name="name" 
                :value="option.value"
                :checked="modelValue === option.value" 
                class="o-form-group__input | visually-hidden"
                :required="required"
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
  value: any;
  key: string;
  info: string;
}

interface Props {
  title: string;
  options: FormOption[];
  modelValue: any;
  name: string;
  required?: boolean;
  divider?: boolean;
  tooltip?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

/**
 * Handle radio button click
 * If not required, allow toggling off by clicking the same option again
 */
function handleClick(value: any) {
  if (!props.required && props.modelValue === value) {
    // Unselect if clicking the same option and not required
    emit('update:modelValue', null);
  } else {
    // Select the new option
    emit('update:modelValue', value);
  }
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

  &__radio {
    background: var(--background-200);
    border: 1px solid var(--secondary-400);
    cursor: pointer;
    text-transform: capitalize;

    &--selected {
      background: var(--secondary-400);
      color: var(--monochrome-900);
    }
  }
}
</style>