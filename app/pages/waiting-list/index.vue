<template>
  <div class="waiting-list-page">
    <!-- Hero Section -->
    <section class="waiting-list-hero">
      <div class="container">
        <div class="waiting-list-hero__content">
          <h1 class="waiting-list-hero__title | title-2xl lineheight-xs">
            The UKs first <span class="gradient-text">private</span> property marketplace
          </h1>
          <p class="waiting-list-hero__subtitle | body-lg">
            Skip the estate agent. Search with AI, buy direct from owners, or list your property yourself. 
            We verify every listing. You save thousands.
          </p>
        </div>
      </div>
    </section>

    <!-- Sign Up Form Section -->
    <section class="waiting-list-form-section">
      <div class="container">
        <div class="waiting-list-form-container">
          <h2 class="waiting-list-form__title | title-md">Get Early Access</h2>
          <p class="waiting-list-form__description | body-md">
            Whether you're searching for your next home or ready to sell without the agent fees, 
            join our waiting list for exclusive early access.
          </p>

          <form 
            @submit.prevent="handleSubmit" 
            class="waiting-list-form"
          >
            <div v-if="formError" class="waiting-list-form__error">
              {{ formError }}
            </div>

            <div class="waiting-list-form__input-group">
              <div class="waiting-list-form__input-wrapper">
                <label for="email" class="waiting-list-form__label | body-sm">
                  Email address
                </label>
                <div class="waiting-list-form__input-button-group">
                  <div class="waiting-list-form__input">
                    <AtomsInput 
                      id="email"
                      v-model="email" 
                      type="email" 
                      name="email" 
                      placeholder="your.email@example.com"
                      required 
                      :disabled="isSubmitting || isSuccess"
                    />
                  </div>
                  <div class="waiting-list-form__submit">
                    <AtomsButton 
                      v-if="!isSuccess"
                      class="waiting-list-form__submit-button | button-monochrome" 
                      type="submit" 
                      :pending="isSubmitting"
                      :disabled="!agreedToTerms || !email"
                    >
                      Join Waiting List
                    </AtomsButton>
                  </div>
                </div>
              </div>
            </div>

            <div class="waiting-list-form__checkbox">
              <label class="waiting-list-form__checkbox-label | body-sm">
                <input 
                  type="checkbox" 
                  v-model="agreedToTerms" 
                  class="waiting-list-form__checkbox-input"
                  :disabled="isSubmitting || isSuccess"
                  required
                />
                <span class="waiting-list-form__checkbox-text">
                  I agree to the 
                  <NuxtLink to="/terms" class="link">Terms & Conditions</NuxtLink> 
                  and 
                  <NuxtLink to="/privacy" class="link">Privacy Policy</NuxtLink>
                </span>
              </label>
            </div>

            <div v-if="isSuccess" class="waiting-list-form__success">
              <AtomsIcon icon="tick" :size="48" class="waiting-list-form__success-icon" />
              <h3 class="title-sm">You're on the list!</h3>
              <p class="body-sm">
                Check your email for confirmation. We'll be in touch soon with your early access details.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- What We're Building Section (Buyers) -->
    <section class="waiting-list-features">
      <div class="container">
        <header class="waiting-list-features__header">
          <h2 class="title-xl">For <span class="gradient-text">Searchers</span></h2>
          <p class="body-md max-width-prose section-subtitle">
            We're building the property search platform we wish existed. AI-powered, data-driven, 
            and brutally honest about what you're actually buying.
          </p>
        </header>

        <div class="waiting-list-features__grid" ref="buyersRef">
          <MoleculesFeatureTile
            iconName="ai/prompt"
            title="AI-Powered Search"
            subtitle="Tell us in plain English"
            description="&quot;Big garden and quiet street&quot; beats ticking 50 boxes. Tell us what you want in plain English. Our AI understands what you actually mean and finds properties that match."
            :class="{ 'animate-in': isBuyersVisible }"
          />

          <MoleculesFeatureTile
            iconName="listings/savings"
            title="Real Data, No Spin"
            subtitle="Facts in one place"
            description="Actual sale prices, genuine crime stats, honest flood risks. We show you the facts estate agents would rather you didn't know, all in one place."
            :class="{ 'animate-in': isBuyersVisible }"
          />

          <MoleculesFeatureTile
            iconName="explore/map"
            title="Map-Based Discovery"
            subtitle="Draw your perfect area"
            description="Draw your perfect area on a map. See everything available at once. No more clicking through hundreds of listings one by one."
            :class="{ 'animate-in': isBuyersVisible }"
          />

          <MoleculesFeatureTile
            iconName="amenities/school"
            title="Neighbourhood Insights"
            subtitle="What it's like to live there"
            description="Schools, transport, broadband speeds, energy costs. All the boring-but-crucial stuff that helps you actually live somewhere, not just buy somewhere."
            :class="{ 'animate-in': isBuyersVisible }"
          />

          <MoleculesFeatureTile
            iconName="listings/eco"
            title="True Running Costs"
            subtitle="Bills before you buy"
            description="See what you'll actually pay in bills before you commit. Energy ratings, council tax bands, typical heating costs—no nasty surprises after you move in."
            :class="{ 'animate-in': isBuyersVisible }"
          />

          <MoleculesFeatureTile
            iconName="property/security"
            title="Buy Direct from Owners"
            subtitle="Verified sellers, no middlemen"
            description="Connect directly with verified private sellers. No middleman markup, no estate agent spin. Just real people selling real homes at fair prices."
            :class="{ 'animate-in': isBuyersVisible }"
          />
        </div>
      </div>
    </section>

    <!-- For Sellers Section -->
    <section class="waiting-list-sellers">
      <div class="container">
        <header class="waiting-list-sellers__header">
          <h2 class="title-xl">For <span class="gradient-text">Sellers</span></h2>
          <p class="body-md max-width-prose section-subtitle">
            The UK's first verified private property marketplace. Create your own listing, 
            connect directly with buyers, and keep the £5,000+ you'd pay an estate agent.
          </p>
        </header>

        <div class="waiting-list-sellers__grid" ref="sellersRef">
          <MoleculesFeatureTile
            iconName="listings/savings"
            title="Save Thousands"
            subtitle="No agent commission"
            description="Estate agents charge 1–2% (£5,000+ on average). We don't. Create your listing yourself and keep every penny."
            variant="blue"

            :class="{ 'animate-in': isSellersVisible }"
          />

          <MoleculesFeatureTile
            iconName="cards/verified"
            title="We Verify Every Listing"
            subtitle="Trust that converts"
            description="We verify ownership and property details. Buyers trust verified listings—so you reach serious, qualified buyers only."
            :class="{ 'animate-in': isSellersVisible }"
            variant="blue"
          />

          <MoleculesFeatureTile
            iconName="account/chat"
            title="Direct Buyer Contact"
            subtitle="Messages without middlemen"
            description="Message buyers directly through our secure platform. Arrange viewings and negotiate on your terms—no filtering."
            :class="{ 'animate-in': isSellersVisible }"
            variant="blue"
          />

          <MoleculesFeatureTile
            iconName="ai/edit"
            title="Easy Listing Creation"
            subtitle="Guided and AI-assisted"
            description="Our guided form makes listing simple. Add photos and details in minutes. AI helps write compelling descriptions that sell."
            :class="{ 'animate-in': isSellersVisible }"
            variant="blue"
          />

          <MoleculesFeatureTile
            iconName="explore/ai"
            title="AI-Matched to Buyers"
            subtitle="Shown to serious buyers"
            description="Your listing is matched to buyers using our AI search. They find you because your property fits what they actually want."
            :class="{ 'animate-in': isSellersVisible }"
            variant="blue"
          />

          <MoleculesFeatureTile
            iconName="content/info"
            title="Full Support & Guidance"
            subtitle="From listing to completion"
            description="New to private selling? Use our guides, checklists, and support throughout. Know what to do at every stage."
            :class="{ 'animate-in': isSellersVisible }"
            variant="blue"
          />
        </div>
      </div>
    </section>

    <!-- Why Early Access Section -->
    <section class="waiting-list-benefits">
      <div class="container">
        <header class="waiting-list-benefits__header">
          <h2 class="title-xl">Why join the waiting list?</h2>
        </header>

        <div class="waiting-list-benefits__cards">
          <AtomsHeroCard variant="primary">
            <h3 class="title-md">Be First to Launch</h3>
            <p class="body-md">
              Get exclusive early access before we open to the public. Be among the first 
              to search with AI or list your property privately in the UK.
            </p>
          </AtomsHeroCard>

          <AtomsHeroCard variant="secondary">
            <h3 class="title-md">Early Bird Benefits</h3>
            <p class="body-md">
              Launch members get special perks and reduced fees. Plus priority support 
              and exclusive features as we roll them out.
            </p>
          </AtomsHeroCard>

          <AtomsHeroCard>
            <h3 class="title-md">Shape the Future</h3>
            <p class="body-md">
              Your feedback matters. Help us build the features that solve real problems 
              for buyers and sellers across the UK.
            </p>
          </AtomsHeroCard>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="waiting-list-final-cta">
      <div class="container">
        <div class="waiting-list-final-cta__content">
          <h2 class="title-xl">Ready to skip the estate agent?</h2>
          <p class="body-lg max-width-prose">
            Join thousands who are ready for honest property search and direct private sales. 
            Whether you're buying or selling, Virify puts you in control.
          </p>
          <AtomsButton 
            @click="scrollToForm" 
            class="waiting-list-final-cta__button | button-lg button-monochrome"
          >
            Join the Waiting List
          </AtomsButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
// Gradient text is used via AtomsGradientText auto-registered component
const email = ref('')
const agreedToTerms = ref(false)
const isSubmitting = ref(false)
const isSuccess = ref(false)
const formError = ref<string | null>(null)

// Intersection Observer helper (mirrors homepage pattern)
const createIntersectionObserver = () => {
  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  useIntersectionObserver(elementRef, (entries) => {
    const [entry] = entries
    if (entry && entry.isIntersecting) {
      isVisible.value = true
    }
  }, { threshold: 0.3 })

  return { elementRef, isVisible }
}

// Buyers (Searchers) grid
const { elementRef: buyersRef, isVisible: isBuyersVisible } = createIntersectionObserver()
// Sellers grid
const { elementRef: sellersRef, isVisible: isSellersVisible } = createIntersectionObserver()

async function handleSubmit() {
  if (!email.value || !agreedToTerms.value) {
    formError.value = 'Please complete all required fields'
    return
  }

  isSubmitting.value = true
  formError.value = null

  // TODO: Implement backend API call
  // Simulate API call for now
  setTimeout(() => {
    isSuccess.value = true
    isSubmitting.value = false
    
    // Track signup event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'waiting_list_signup', {
        method: 'email'
      })
    }
  }, 1000)
}

function scrollToForm() {
  const formSection = document.querySelector('.waiting-list-form-section')
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// SEO Meta
useHead({
  title: 'Join the Waiting List - Virify',
  meta: [
    {
      name: 'description',
      content: "Join the waiting list for Virify - the UK's first private property marketplace. AI-powered search and verified private listings. Skip the estate agent, save thousands."
    }
  ]
})
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

// Hero Section
.waiting-list-hero {
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  color: var(--monochrome-900);
  padding: var(--size-80) var(--size-32) var(--size-64);
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @include mq.tablet {
    padding: var(--size-120) var(--size-32) var(--size-80);
    background: 
      url('/img/logo-background.svg') no-repeat top right,
      linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
    background-size: auto 120%, cover;
  }

  &__content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  &__title {
    margin-bottom: var(--size-24);
    color: var(--monochrome-900);
  }

  &__subtitle {
    margin: 0 auto;
    color: var(--monochrome-900);
  }
}

// Form Section
.waiting-list-form-section {
  padding: var(--size-64) 0;
  margin: 0;
  position: relative;
  z-index: 2;

  @include mq.mobile-only {
    padding: var(--size-64) 0;
    margin: 0;
  }
}

.waiting-list-form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--size-48);

  @include mq.mobile-only {
    padding: var(--size-32);
  }
}

.waiting-list-form {
  &__title {
    margin: 0 0 var(--size-12) 0;
    text-align: center;
  }

  &__description {
    text-align: center;
    color: var(--text-muted);
    /* Center and cap width so input area can match */
    max-width: 800px;
    margin: 0 auto var(--size-32);
  }

  &__error {
    padding: var(--size-16);
    background: fn.faded-color(10%, var(--error));
    border: 1px solid var(--error);
    border-radius: var(--border-radius-md);
    color: var(--error);
    margin-bottom: var(--size-24);
    text-align: center;
  }

  &__input-group {
    margin-bottom: var(--size-20);
  }

  /* Wrapper to center input + button and match description width */
  &__input-wrapper {
    max-width: 800px;
    margin: 0 auto;
  }

  &__label {
    display: block;
    margin-bottom: var(--size-8);
  }

  &__input-button-group {
    display: flex;
    gap: var(--size-12);
    /* Align to the top of the input row so inline errors don't push the button down */
    align-items: flex-start;

    @include mq.mobile-only {
      flex-direction: column;
      align-items: stretch;
      gap: var(--size-12);
    }
  }

  &__input {
    flex: 1;
    width: 100%;
  }

  &__submit-button {
    flex-shrink: 0;
    white-space: nowrap;
    padding: var(--size-12) var(--size-24);

    @include mq.mobile-only {
      width: 100%;
    }
  }

  /* Wrapper for submit button so we can control alignment in the row */
  &__submit {
    align-self: flex-start; // keep button aligned with top of input when error message shows

    @include mq.mobile-only {
      align-self: stretch;
    }
  }

  &__checkbox {
    /* Align with input/description width */
    max-width: 800px;
    margin: var(--size-20) auto;
  }

  &__checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: var(--size-12);
    cursor: pointer;
    user-select: none;
  }

  &__checkbox-input {
    flex-shrink: 0;
    width: var(--size-20);
    height: var(--size-20);
    margin-top: var(--size-2);
    cursor: pointer;
    accent-color: var(--secondary-400);

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &__checkbox-text {
    flex: 1;
    line-height: 1.5;

    .link {
      color: var(--secondary-400);
      text-decoration: underline;
      font-weight: 500;

      &:hover {
        color: var(--secondary-500);
      }
    }
  }

  &__success {
    text-align: center;
    padding: var(--size-32) var(--size-16);
    background: fn.faded-color(10%, var(--primary-400));
    border-radius: var(--border-radius-lg);
    border: 2px solid var(--primary-400);
    margin-top: var(--size-24);

    h3 {
      margin: var(--size-16) 0 var(--size-8);
      color: var(--foreground-100);
    }

    p {
      color: var(--text-muted);
      margin: 0;
    }
  }

  &__success-icon {
    color: var(--primary-400);
  }
}

// Features Section
.waiting-list-features {
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  color: var(--monochrome-900);
  padding: var(--size-64) 0;
  margin: 0;

  &__header {
    text-align: center;
    margin-bottom: var(--size-48);

    h2 {
      margin-bottom: var(--size-16);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-32);

    @include mq.tablet {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mq.notebook {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

// Sellers Section
.waiting-list-sellers {
  padding: var(--size-64) 0;
  margin: 0;

  &__header {
    text-align: center;
    margin-bottom: var(--size-48);

    h2 {
      margin-bottom: var(--size-16);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-32);

    @include mq.tablet {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mq.notebook {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

.waiting-list-feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-xl);
  padding: var(--size-32);
  text-align: center;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease, background-color 200ms ease;

  &:hover,
  &:focus-within {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
    border-color: fn.faded-color(40%, var(--secondary-400));
    background: rgba(255, 255, 255, 0.14);
  }

  &--alt {
    background: var(--background-100);
    backdrop-filter: none;
    border: 1px solid var(--border-color-200);

    &:hover,
    &:focus-within {
      border-color: var(--secondary-400);
      box-shadow: 0 6px 16px rgba(60, 80, 180, 0.14), 0 2px 8px rgba(0, 0, 0, 0.06);
    }
  }

  &__icon {
    margin: 0 auto var(--size-20);
    width: var(--size-64);
    height: var(--size-64);
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius-lg);
    color: var(--monochrome-900);

    // Accent hover glow
    .waiting-list-feature-card:hover &,
    .waiting-list-feature-card:focus-within & {
      box-shadow: 0 0 0 6px fn.faded-color(20%, var(--secondary-400));
    }

    .waiting-list-feature-card--alt & {
      background: fn.faded-color(10%, var(--secondary-400));
      color: var(--secondary-400);

      .waiting-list-feature-card:hover &,
      .waiting-list-feature-card:focus-within & {
        box-shadow: 0 0 0 6px fn.faded-color(16%, var(--secondary-400));
      }
    }
  }

  &__title {
    margin: 0 0 var(--size-12) 0;
    color: var(--monochrome-900);

    .waiting-list-feature-card--alt & {
      color: var(--foreground-100);
    }
    // Title accent on hover
    .waiting-list-feature-card:hover &,
    .waiting-list-feature-card:focus-within & {
      color: var(--secondary-400);
    }
  }

  &__description {
    margin: 0;
    color: var(--monochrome-900);
    opacity: 0.9;

    .waiting-list-feature-card--alt & {
      color: var(--text-muted);
      opacity: 1;
    }
  }
}

// Animations for feature cards (buyers) and seller cards
.waiting-list-features__grid {
  .feature-tile {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;

    &.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
  }
  // Staggered animation delays (explicit to avoid build issues)
  .feature-tile:nth-child(1) { transition-delay: 0.1s; }
  .feature-tile:nth-child(2) { transition-delay: 0.2s; }
  .feature-tile:nth-child(3) { transition-delay: 0.3s; }
  .feature-tile:nth-child(4) { transition-delay: 0.4s; }
  .feature-tile:nth-child(5) { transition-delay: 0.5s; }
  .feature-tile:nth-child(6) { transition-delay: 0.6s; }
}

.waiting-list-sellers__grid {
  .feature-tile {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;

    &.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
  }
  // Staggered animation delays (explicit)
  .feature-tile:nth-child(1) { transition-delay: 0.1s; }
  .feature-tile:nth-child(2) { transition-delay: 0.2s; }
  .feature-tile:nth-child(3) { transition-delay: 0.3s; }
  .feature-tile:nth-child(4) { transition-delay: 0.4s; }
  .feature-tile:nth-child(5) { transition-delay: 0.5s; }
  .feature-tile:nth-child(6) { transition-delay: 0.6s; }
}

// Benefits Section
.waiting-list-benefits {
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  color: var(--monochrome-900);
  padding: var(--size-64) 0;
  margin: 0;

  &__header {
    text-align: center;
    margin-bottom: var(--size-48);
  }

  &__cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-24);
    max-width: 1200px;
    margin: 0 auto;

    @include mq.tablet {
      grid-template-columns: repeat(3, 1fr);
    }

    h3 {
      margin: 0 0 var(--size-16) 0;
    }

    p {
      margin: 0;
    }
  }
}

// Final CTA Section
.waiting-list-final-cta {
  padding: var(--size-64) 0;
  margin: 0;

  &__content {
    text-align: center;
    max-width: 700px;
    margin: 0 auto;

    h2 {
      margin-bottom: var(--size-16);
    }

    p {
      margin-bottom: var(--size-32);
    }
  }

  &__button {
    min-width: 280px;
  }
}

// Shared styles
.section-hero-bg {
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  color: var(--monochrome-900);
  padding: var(--size-120) 0 var(--size-80);
}

.homepage-section {
  padding: var(--size-120) 0 var(--size-80);
}

.max-width-prose {
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
}

.section-subtitle {
  margin: var(--size-12) auto 0;
}
</style>