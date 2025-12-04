<template>
  <label class="a-checktext | body-sm font-semibold">
    <input type="checkbox" :value :checked v-model="isChecked" class="| visually-hidden" />

    <span class="a-checktext__box" aria-hidden>
      <AtomsIcon icon="tick" aria-hidden class="a-checktext__icon" />
    </span>

    <span class="a-checktext__text | body-md">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value?: string | number
  checked?: boolean
}

defineProps<Props>()

const isChecked = defineModel({
  default: (props) => !!props.checked
})
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.a-checktext {
  display: flex;
  gap: var(--size-12);
  cursor: pointer;

  &__box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-28);
    height: var(--size-28);
    border-radius: var(--border-radius-lg);
    background: #{ fn.faded-color(10%) };
    border: 2px solid #{ fn.faded-color(20%) };
  }

  &__icon {
    display: none;
    width: var(--size-24);
    height: var(--size-24);
  }

  &__text {
    font-weight: var(--font-medium);
  }

  // &:has(input:checked) {
  //   color: currentColor;

  //   &:hover {
  //     background: #{ fn.faded-color(10%) };
  //   }
  // }

  &:has(input:checked) &__icon {
    display: block;
  }
}
</style>