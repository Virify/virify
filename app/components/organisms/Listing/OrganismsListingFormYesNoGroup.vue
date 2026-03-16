<template>
  <div class="o-form-group">
    <AtomsDivider v-if="divider" />
    <MoleculesListingFormHeading :title="title" :required="required" :tooltip="tooltip"
      :hasTooltip="!!tooltip || !!$slots['tooltip-content']">
      <template #tooltip-content>
        <slot name="tooltip-content">
          <p v-if="tooltip" class="body-sm">{{ tooltip }}</p>
        </slot>
      </template>
    </MoleculesListingFormHeading>
    <ul class="o-form-group__list">
      <li class="o-form-group__item">
        <label class="o-form-group__label | body-sm" @click.prevent="handleClick(true)">
          <AtomsPill class="o-form-group__radio" :class="{ 'o-form-group__radio--selected': modelValue === true }">
            <input type="radio" :name="name" :value="true" :checked="modelValue === true"
              class="o-form-group__input | visually-hidden" :required="required" />
            Yes
          </AtomsPill>
        </label>
      </li>
      <li class="o-form-group__item">
        <label class="o-form-group__label | body-sm" @click.prevent="handleClick(false)">
          <AtomsPill class="o-form-group__radio" :class="{ 'o-form-group__radio--selected': modelValue === false }">
            <input type="radio" :name="name" :value="false" :checked="modelValue === false"
              class="o-form-group__input | visually-hidden" :required="required" />
            No
          </AtomsPill>
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  modelValue: boolean;
  name: string;
  required?: boolean;
  divider?: boolean;
  tooltip?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

/**
 * Handle yes/no button click
 */
function handleClick(value: boolean) {
  emit('update:modelValue', value);
}
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;

.o-form-group {
  padding: var(--size-32) 0;

  @include mq.mobile-only {
    padding: var(--size-16) 0;
  }

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
    background: var(--background-100);
    border: 1px solid light-dark(var(--blue-400), var(--blue-500));
    cursor: pointer;
    text-transform: capitalize;

    &--selected {
      background: light-dark(var(--blue-400), var(--blue-500));
      color: var(--monochrome-900);
    }
  }
}
</style>
