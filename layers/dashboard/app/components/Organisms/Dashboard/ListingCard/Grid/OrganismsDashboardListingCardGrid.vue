<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 uw-grid gap-4 pb-5">
    <slot />
  </div>
</template>
<style scoped>
  @media (min-width: 1921px) {
    .uw-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    }
  }
  @media (min-width: 3000px) {
    .uw-grid {
      grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
    }
  }
  @media (min-width: 4000px) {
    .uw-grid {
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
    }
  }
</style>
