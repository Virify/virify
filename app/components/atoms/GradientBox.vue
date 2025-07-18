<template>
  <div class="gradient-box">
    <div class="gradient-box-content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">

.gradient-box {
  border: var(--size-2) solid var(--secondary-400);
  border-radius: var(--border-radius-2xl);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 10px 25px rgba(0, 0, 0, 0.03),
    0 20px 40px rgba(0, 0, 0, 0.02);
  overflow: hidden;
}

.gradient-box-content {
  background: var(--background-100);
  padding: var(--size-24);
  color: var(--foreground-100);
  border-radius: inherit;
}
</style>
