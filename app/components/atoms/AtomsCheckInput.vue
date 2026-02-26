<template>
  <input type="checkbox" :required :aria-label :name :value :checked class="| visually-hidden" />
  <span class="a-check-input" v-bind="$attrs" aria-hidden>
    <AtomsIcon icon="tick" />
  </span>
</template>

<script setup lang="ts">
interface Props {
  name?: string
  ariaLabel?: string
  checked?: any
  required?: any
  value?: any
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false
})

</script>

<style lang="scss">
.a-check-input {
  display: block;
  box-sizing: border-box;
  cursor: pointer;
  transition: color var(--animation-fast), background-color var(--animation-fast);
  flex: 0 0 auto;

  .a-icon {
    display: none;
    width: 100%;
    height: 100%;
  }
}

input:checked+.a-check-input {

  .a-icon {
    display: block;
  }
}

:where(.a-check-input) {
  width: var(--size-24);
  height: var(--size-24);
  border: 2px solid var(--monochrome-500);
  border-radius: var(--border-radius-md);

  &:hover {
    border-color: var(--monochrome-900);
  }
}
</style>