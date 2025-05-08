<template>
  <select class="a-select">
    <slot />
  </select>
</template>

<style lang="scss">
.a-select {
  appearance: none;
  background-position: right;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='black'><path d='M16 19L11 14H21L16 19Z'/></svg>");

  @media (prefers-color-scheme: dark) {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='white'><path d='M16 19L11 14H21L16 19Z'/></svg>")
  }
}
</style>