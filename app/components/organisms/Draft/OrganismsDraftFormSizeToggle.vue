<template>
  <div class="o-form-group">
    <AtomsDivider v-if="divider" />
    <p class="o-form-group__title | body-sm">{{ title }}
      <span v-if="required" class="o-form-group__required | title-xs">*</span>
    </p>
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
          step="0.01"
          inputmode="decimal"
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
  get: () => (props.size != null ? String(props.size) : ''),
  set: (val: string) => emit('update:size', val !== '' ? Number(val) : null)
})
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;
.o-form-group {
  padding: var(--size-32) 0;
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

    @include mq.mobile-only {
      flex-direction: column;
      align-items: center;
      gap: var(--size-12);
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    justify-content: baseline;
    gap: var(--size-4);
    max-width: 250px;
    width: 250px;

    @include mq.mobile-only {
      width: 100%;
      max-width: none;
    }
  }
}
</style>