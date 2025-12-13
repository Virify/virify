<template>
  <div class="m-form-navigation">
    <button 
      v-if="showBack"
      class="| button button-tertiary button-sm" 
      @click="$emit('back')"
    >
      Back
    </button>
    <button 
      v-if="showReset"
      class="| button button-tertiary button-sm" 
      @click="$emit('reset')"
    >
      Start over
    </button>
    <button 
      v-if="showNext"
      class="| button button-secondary button-md" 
      :disabled="!canProceed"
      @click="$emit('next')"
    >
      Next
    </button>
    <button 
      v-if="showCalculate"
      class="| button button-secondary button-md" 
      :disabled="!canCalculate || isCalculating"
      @click="$emit('calculate')"
    >
      {{ isCalculating ? 'Calculating...' : 'Calculate' }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showBack?: boolean
  showReset?: boolean
  showNext?: boolean
  showCalculate?: boolean
  canProceed?: boolean
  canCalculate?: boolean
  isCalculating?: boolean
}

withDefaults(defineProps<Props>(), {
  showBack: false,
  showReset: false,
  showNext: false,
  showCalculate: false,
  canProceed: true,
  canCalculate: true,
  isCalculating: false,
})

defineEmits<{
  back: []
  reset: []
  next: []
  calculate: []
}>()
</script>

<style lang="scss" scoped>
.m-form-navigation {
  display: flex;
  gap: var(--size-12);
  justify-content: center;
  width: 100%;
  margin-top: var(--size-8);

  .button-tertiary {
    background: rgba(255, 255, 255, 0.2);
    color: var(--monochrome-900);
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}
</style>
