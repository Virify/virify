<template>
  <div class="account-card-container">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.account-card-container {
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
</style>