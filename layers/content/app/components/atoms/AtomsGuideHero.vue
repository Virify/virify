<template>
  <section class="guides-hero">
    <div class="guides-hero__content">
      <h1 class="guides-hero__title | title-xl">{{ title }}</h1>
      <p class="guides-hero__description | body-md">
        {{ description }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<style scoped lang="scss">
.guides-hero {
  position: relative;
  height: 300px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80");
  background-size: cover;
  background-position: center;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 300px;
  }

  &__content {
    max-width: 600px;
    padding: 0 var(--size-32);
  }

  &__title {
    color: var(--monochrome-900);
  }

  &__description {
    color: var(--monochrome-900);
  }
}
</style>
