<template>
  <div class="o-form-group">
    <AtomsDivider v-if="divider" />
    <p class="o-form-group__title | body-sm">{{ title }}</p>
    <div class="o-form-group__toggle">
      <AtomsToggle
        v-model="localUnit"
        :options="localOptions"
        :name="name"
      />
      <div class="o-form-group__text">
        <AtomsInput
          type="number"
          min="0"
          v-model="localSize"
          :name="name ? `${name}-size` : 'property-size'"
          :placeholder="`Size in ${localUnit === 'feet' ? 'feet' : 'meters'}`"
          :required="required"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormOption {
  value: any;
  key?: string;
  info?: string;
  name?: string;
  isDefault?: boolean;
}

interface Props {
  title: string;
  options: FormOption[];
  unit?: string;
  size?: number | null;
  name?: string;
  required?: boolean;
  divider?: boolean;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:unit', value: string | undefined): void
  (e: 'update:size', value: number | null): void
}>()

const localOptions = computed(() => props.options ?? [])

const localUnit = computed<string | number | undefined>({
  get() {
    return props.unit
  },
  set(val) {
    emit('update:unit', val as string)
  }
})

const localSize = computed<string>({
  get: () => (String(props.size) ?? ''),
  set: (val: string) => {
    // convert to meters if feet is selected
    if (props.unit === 'feet') {
      emit('update:size', convertFeetToMeters(Number(val)))
    } else {
      emit('update:size', Number(val))
    }
  }
})
</script>

<style lang="scss">
.o-form-group {

  &__title {
    text-align: center;
    padding-bottom: var(--size-16);
  }

  &__toggle {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: var(--size-16);
    justify-content: center;
    margin-top: var(--size-16);
    margin-bottom: var(--size-32);
  }

  &__text {
    display: flex;
    flex-direction: column;
    justify-content: baseline;
    gap: var(--size-4);
  }
}
</style>