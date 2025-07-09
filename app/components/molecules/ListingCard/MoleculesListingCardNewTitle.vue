<template>
  <div>
    <h3 class="m-listing-card-title | body-md font-semibold">
      Detached House
    </h3>
    <p class="m-listing-card-location | body-xs faded-text">
      Cardiff, CF15
    </p>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss">
.m-listing-card-location {
  margin-bottom: var(--size-8);
}

@media (max-width: 768px) {
  .m-listing-card-title {
    font-size: var(--font-lg);
  }
}
</style>
