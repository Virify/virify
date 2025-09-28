<template>
  <div class="o-header | pointer-none">
    <div class="o-header-container | container">
      <OrganismsSiteNavigation class="| pointer" />
    </div>
  </div>
</template>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-header {
  position: sticky;
  top: env(safe-area-inset-top);
  z-index: 30;
  background: var(--blue-400);
  border-bottom: var(--size-4) solid var(--secondary-400);
  height: 100%;

  &-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: var(--header-height);
  }
}

</style>