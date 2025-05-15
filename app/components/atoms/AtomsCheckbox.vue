<template>
  <label class="a-checkbox | body-sm font-semibold">
    <input type="checkbox" :value :checked v-model="isChecked" class="| visually-hidden" />
    <AtomsIcon icon="tick-solid" aria-hidden class="a-checkbox-icon" />
    <span class="a-checkbox-text">
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

.a-checkbox {
  position: relative;
  display: block;
  border: 1px solid light-dark(var(--monochrome-700), var(--monochrome-400));
  padding: var(--size-6) var(--size-28);
  line-height: var(--lineheight-md);
  border-radius: var(--border-radius-pill);
  cursor: pointer;
  transition-property: transform, color, background-color, border-color;
  transition-duration: var(--animation-fast);
  transition-timing-function: var(--ease-out);
  user-select: none;
  color: #{ fn.faded-color(50%) };

  &:hover {
    color: currentColor;
    background: #{ fn.faded-color(6%) };
    border-color: light-dark(var(--monochrome-600), var(--monochrome-500));
  }

  &-icon {
    display: none;
    position: absolute;
    top: 50%;
    right: var(--size-8);
    width: var(--size-24);
    height: var(--size-24);
    transform: translateY(-50%);
    transform-origin: 50% 0;
    scale: 1;
    transition: scale var(--animation-slow) var(--bounce-out);

    @starting-style {
      scale: 0
    }
  }

  &-text {
    display: block;
    transition: transform var(--animation-fast) var(--ease-out);
  }

  &:has(input:checked) {
    color: currentColor;
    background: #{ fn.faded-color(6%) };
    border-color: light-dark(var(--monochrome-600), var(--monochrome-500));

    &:hover {
      background: #{ fn.faded-color(10%) };
    }
  }

  &:has(input:checked) &-icon {
    display: block;
  }

  &:has(input:checked) &-text {
    transform: translateX(calc(0px - var(--size-10)));
  }

  &:active {
    transform: scale(0.98);
  }
}
</style>