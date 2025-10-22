<template>
  <div class="a-number-range | gradient-box">
    <label>
      From
      <input type="number" />
    </label>
    <label>
      To
      <input type="number" />
    </label>
  </div>
</template>

<script setup></script>

<style lang="scss">
.a-number-range {
  padding: var(--size-12);

  input {
    display: block;
  }
}
</style>