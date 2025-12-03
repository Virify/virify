<template>
  <div class="estate-agent">
    <section class="estate-agent__hero">
      <div class="estate-agent__hero-content">
        <h1 class="estate-agent__title">{{ estateConfig.about.title }}</h1>
        <p class="estate-agent__subtitle">{{ estateConfig.about.subtitle }}</p>
      </div>
    </section>

    <main class="estate-agent__main">
      <section class="estate-agent__content">
        <p v-for="(paragraph, index) in estateConfig.about.paragraphs" :key="index" class="estate-agent__text">
          {{ paragraph }}
        </p>
      </section>
    </main>

    <section class="estate-agent__contact">
      <h2 class="estate-agent__contact-title">Get in touch</h2>
      <p class="estate-agent__contact-text">
        Questions about how this works? Want to see your own properties here?
      </p>
      <div class="estate-agent__contact-methods">
        <a :href="`tel:${estateConfig.phone}`" class="estate-agent__contact-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          {{ estateConfig.phone }}
        </a>
        <a :href="`mailto:${estateConfig.email}`" class="estate-agent__contact-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          {{ estateConfig.email }}
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'estate' })
</script>

<style scoped lang="scss">
.estate-agent {
  min-height: 100vh;

  &__hero {
    padding: 4rem 2.5rem;
    border-radius: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    position: relative;
    overflow: hidden;
    text-align: center;
  }

  &__hero-content {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  &__title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 1rem;
    line-height: 1.1;
  }

  &__subtitle {
    font-size: 1.25rem;
    opacity: 0.95;
    color: white;
  }

  &__main {
    padding: 4rem 1.5rem;
    max-width: 800px;
    margin: 0 auto;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: white;
    padding: 3rem 2.5rem;
    border-radius: 1.5rem;
    border: 1px solid #e2e8f0;
  }

  &__text {
    font-size: 1.0625rem;
    line-height: 1.8;
    color: #475569;
  }

  &__contact {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 0;
    padding: 3rem 2rem;
    text-align: center;
    margin-top: 2rem;
  }

  &__contact-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: white;
  }

  &__contact-text {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    color: white;
    opacity: 0.95;
  }

  &__contact-methods {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }

  &__contact-link {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 0.75rem;
    color: white;
    text-decoration: none;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;

    svg {
      flex-shrink: 0;
      color: white;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }
  }
}
</style>
