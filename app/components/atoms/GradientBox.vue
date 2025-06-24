<template>
  <div class="gradient-box">
    <div class="gradient-box-content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.gradient-box {
  background: linear-gradient(135deg, var(--primary-600), var(--secondary-500));
  border-radius: var(--border-radius-2xl);
  padding: 3px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 10px 25px rgba(0, 0, 0, 0.03),
    0 20px 40px rgba(0, 0, 0, 0.02);
}

.gradient-box-content {
  background: white;
  border-radius: calc(var(--border-radius-2xl) - 3px);
  padding: var(--size-24);
}
</style>
