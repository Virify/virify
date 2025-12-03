<template>
  <div class="estate-agent">
    <main class="estate-agent__main">
      <section class="estate-agent__hero">
        <div class="estate-agent__hero-content">
          <span class="estate-agent__badge">{{ estateConfig.name }}</span>
          <h1 class="estate-agent__title">
            {{ estateConfig.hero.title }}
          </h1>
          <p class="estate-agent__subtitle">
            {{ estateConfig.hero.subtitle }}
          </p>
          <div class="estate-agent__actions">
            <button class="estate-agent__btn estate-agent__btn--primary">
              {{ estateConfig.hero.primaryCta }}
            </button>
            <button class="estate-agent__btn estate-agent__btn--secondary">
              {{ estateConfig.hero.secondaryCta }}
            </button>
          </div>
        </div>
        <div class="estate-agent__hero-card">
          <div class="estate-agent__stat">
            <div class="estate-agent__stat-value">100+</div>
            <div class="estate-agent__stat-label">Properties sold</div>
          </div>
          <Separator class="estate-agent__separator" />
          <div class="estate-agent__stat">
            <div class="estate-agent__stat-value">4.9/5</div>
            <div class="estate-agent__stat-label">Customer rating</div>
          </div>
          <Separator class="estate-agent__separator" />
          <div class="estate-agent__stat">
            <div class="estate-agent__stat-value">15+</div>
            <div class="estate-agent__stat-label">Years experience</div>
          </div>
        </div>
      </section>

      <section class="estate-agent__features">
        <h2 class="estate-agent__section-title">Why choose us</h2>
        <div class="estate-agent__features-grid">
          <div class="estate-agent__feature-card">
            <svg class="estate-agent__feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <h3 class="estate-agent__feature-title">Local expertise</h3>
            <p class="estate-agent__feature-text">
              Deep knowledge of the local property market and community
            </p>
          </div>
          <div class="estate-agent__feature-card">
            <svg class="estate-agent__feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline>
            </svg>
            <h3 class="estate-agent__feature-title">Fast turnaround</h3>
            <p class="estate-agent__feature-text">
              Quick valuations and efficient sales process to get you moved
            </p>
          </div>
          <div class="estate-agent__feature-card">
            <svg class="estate-agent__feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <h3 class="estate-agent__feature-title">Personal service</h3>
            <p class="estate-agent__feature-text">
              Dedicated agent who knows you and your property inside out
            </p>
          </div>
        </div>
      </section>

      <section class="estate-agent__properties">
        <div class="estate-agent__properties-header">
          <h2 class="estate-agent__section-title">Featured properties</h2>
          <p class="estate-agent__section-subtitle">
            Browse our latest properties available in London
          </p>
        </div>
        <div class="estate-agent__properties-grid">
          <!-- Original MoleculesCardBasic - commented out due to carousel crash
          <MoleculesCardBasic 
            v-for="listing in mockListings" 
            :key="listing.id"
            :result="listing as any"
          />
          -->
          <EstatePropertyCard 
            v-for="listing in mockListings" 
            :key="listing.id"
            :listing="listing"
          />
        </div>
      </section>

      <section class="estate-agent__contact">
        <h2 class="estate-agent__contact-title">Ready to get started?</h2>
        <p class="estate-agent__contact-text">
          Get in touch for a free property valuation or to discuss your needs
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { Separator } from 'reka-ui'

definePageMeta({ layout: 'estate' })
</script>

<style scoped lang="scss">
.estate-agent {
  min-height: 100vh;
  background: #fafafa;

  &__main {
    padding: 3rem 1.5rem 4rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  &__hero {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 4rem;
    padding: 3rem 2rem;
    border-radius: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 320px;
      gap: 3rem;
    }
  }

  &__hero-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    width: fit-content;
  }

  &__title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 1rem;
    line-height: 1.1;
  }

  &__subtitle {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    opacity: 0.95;
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__btn {
    padding: 0.875rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 0.75rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &--primary {
      background: white;
      color: #667eea;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }
    }

    &--secondary {
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: white;
      }
    }
  }

  &__hero-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border-radius: 1.25rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &__separator {
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    margin: 1rem 0;
  }

  &__stat {
    text-align: center;
    padding: 0.75rem 0;
  }

  &__stat-value {
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
  }

  &__stat-label {
    font-size: 0.875rem;
    opacity: 0.9;
  }

  &__features {
    margin-bottom: 4rem;
  }

  &__section-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    text-align: center;
    color: #1f2937;
  }

  &__features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  &__feature-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
  }

  &__feature-icon {
    width: 3rem;
    height: 3rem;
    margin: 0 auto 1rem;
    color: #667eea;
  }

  &__feature-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: #1f2937;
  }

  &__feature-text {
    color: #6b7280;
    line-height: 1.6;
  }

  &__properties {
    margin-bottom: 4rem;
  }

  &__properties-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  &__section-subtitle {
    font-size: 1rem;
    color: #6b7280;
  }

  &__properties-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  &__contact {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 1.5rem;
    padding: 3rem 2rem;
    text-align: center;
  }

  &__contact-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  &__contact-text {
    font-size: 1.125rem;
    margin-bottom: 2rem;
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
    }

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }
  }
}
</style>