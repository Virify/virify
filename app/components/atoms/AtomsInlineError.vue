<template>
  <span class="a-inline-error | body-sm lineheight-sm" role="alert" aria-live="polite">
    <AtomsIcon icon="errors/error" aria-hidden class="a-inline-error-icon" />

    <slot></slot>
  </span>
</template>

<style>
.a-inline-error {
  display: flex;
  align-items: center;
  color: var(--error-foreground);
  gap: var(--size-14);
  padding: var(--size-14) var(--size-16);
  background: var(--error-background-100);
  border-radius: var(--border-radius-ui);
}

.a-inline-error-icon {
  flex: 0 0 auto;
  width: var(--size-24);
  height: var(--size-24);
}
</style>