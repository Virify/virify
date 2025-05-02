<template>
  <PinInputRoot type="number" otp class="m-otp" @complete="notifyCompletion">
    <PinInputInput v-for="(id, index) in otpLength" :id :index="index" placeholder="○" class="m-otp-input" />
  </PinInputRoot>
</template>

<script setup lang="ts">
import { PinInputInput, PinInputRoot } from 'reka-ui'

/**
 *  Props
 */
withDefaults(defineProps<{ otpLength?: number }>(), {
  otpLength: 6
})

/**
 *  Events
 */
const emits = defineEmits(['complete'])

function notifyCompletion(otpCode) {
  emits('complete', otpCode.join(''))
}
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;
@use '#styles/_utils/media' as mq;

.m-otp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-6);
}

.m-otp-input {
  display: block;
  width: var(--size-48);
  height: var(--size-48);
  padding: 0;
  margin: 0;
  text-align: center;
  border: 1px solid fn.faded-color(10%);
  background: var(--background-200);
  color: var(--foreground-100);
  border-radius: var(--border-radius-ui);

  @include mq.tablet {
    width: var(--size-56);
    height: var(--size-56);
  }
}
</style>