<template>
  <footer class="o-footer">
    <div class="| container">
      <p class="| body-sm">Copyright &copy; Virify Ltd {{ currentYear }}</p>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;
.o-footer {
  background-color: var(--blue-400);
  color: var(--background-100);
  padding: var(--size-32) 0;
  color: var(--monochrome-900);
  width: 100%;

  @include mq.mobile-only {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>