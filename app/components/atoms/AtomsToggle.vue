<template>
  <div v-if="hasOptions" class="a-toggle" role="radiogroup" :aria-label="ariaLabel">
    <div v-for="(opt, idx) in options" :key="`option-${idx}-${opt.value}`">
      <input :key="`input-${idx}-${opt.value}`" type="radio" :id="`toggle-${opt.value}`" class="visually-hidden"
        :name="name" :value="opt.value" :checked="modelValue === opt.value"
        @change="() => opt.value !== undefined && select(opt.value)" />

      <label :key="`label-${idx}-${opt.value}`" :for="`toggle-${opt.value}`" class="a-toggle__option | body-sm"
        tabindex="0">
        {{ opt.label ?? opt.name ?? opt.value }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option { value: string | number; label?: string; name?: string; isDefault?: boolean }

const props = defineProps<{
  modelValue?: string | number;
  options?: Option[];
  ariaLabel?: string;
  name?: string;
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const hasOptions = computed(() => Array.isArray(props.options) && props.options.length >= 1)
const options = computed(() => props.options ?? [])

function select(value: string | number) {
  if (value === props.modelValue) return
  emit('update:modelValue', value)
}
</script>

<style lang="scss">
.a-toggle {
  display: inline-flex;
  margin-top: var(--size-4);
  padding: 3px;
  background: var(--background-100);
  border-radius: var(--border-radius-2xl);
  border: 1px solid var(--blue-500);
  box-sizing: border-box;
  width: fit-content;
  overflow: hidden;

  &__option {
    appearance: none;
    border: none;
    background: transparent;
    padding: var(--size-8) var(--size-16);
    cursor: pointer;
    color: var(--foreground-100);
    border-radius: var(--border-radius-2xl);
    transition: background 0.15s ease, color 0.15s ease;
    line-height: unset;
  }

  &__option--active {
    background: light-dark(var(--blue-400), var(--blue-500));
    color: var(--monochrome-900);
  }

  input[type="radio"]:checked+label.a-toggle__option {
    background: light-dark(var(--blue-400), var(--blue-500));
    color: var(--monochrome-900);
  }

  label.a-toggle__option {

    &:hover,
    &:focus {
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02) inset;
    }
  }
}
</style>
