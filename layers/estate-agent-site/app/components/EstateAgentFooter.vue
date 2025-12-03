<template>
  <footer class="estate-footer">
    <div class="estate-footer__inner">
      <p class="estate-footer__text">
        © {{ new Date().getFullYear() }} Demo Estate Agent · Powered by Virify
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.estate-footer {
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  margin-top: 3rem;

  &__inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 1.25rem 1.5rem;
    text-align: center;
  }

  &__text {
    font-size: 0.875rem;
    color: #6b7280;
  }
}
</style>
