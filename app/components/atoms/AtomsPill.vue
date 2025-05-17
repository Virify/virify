<template>
  <span class="a-pill">
    <slot></slot>
  </span>
</template>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

:where(.a-pill) {
  font-size: var(--font-sm);
  line-height: var(--lineheight-md);
  font-weight: var(--font-medium);
}

.a-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  background: var(--background-300);
  color: var(--foreground-300);
  padding: var(--size-4) var(--size-14);
  border-radius: var(--border-radius-pill);
}
</style>