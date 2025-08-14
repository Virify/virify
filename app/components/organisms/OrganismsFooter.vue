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

<style>
.o-footer {
  background-color: var(--blue-400);
  color: var(--background-100);
  padding: var(--size-32) 0;
  color: var(--monochrome-900);
  bottom: 0;
  width: 100%;
}
</style>