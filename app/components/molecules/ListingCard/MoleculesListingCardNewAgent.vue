<template>
  <div class="m-listing-card-agent">
    <div class="m-listing-card-agent-logo">
      <AtomsIcon name="check" icon="tick-solid" />
    </div>
    <p class="body-xs font-semibold">MaggotBalls</p>
  </div>
</template>

<style lang="scss">
.m-listing-card-agent {
  align-items: center;
  display: flex;
  gap: var(--size-8);
}

.m-listing-card-agent-logo {
  align-items: center;
  background-color: var(--secondary-400);
  border-radius: 50%;
  color: var(--monochrome-900);
  display: flex;
  font-size: var(--font-21xl);
  height: var(--size-32);
  justify-content: center;
  width: var(--size-32);
}
</style>
