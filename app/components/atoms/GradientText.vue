<template>
  <span class="gradient-text">
    <slot />
  </span>
</template>

<style scoped lang="scss">
.gradient-text {
  background: linear-gradient(135deg, var(--primary-600), var(--secondary-500));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}
</style>
