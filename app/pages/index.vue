<template>
  <div class="homepage">
    <!-- AI Search Hero -->
    <div class="container">
      <OrganismsHeroSearch @selectSuggestion="handleSuggestionSelect" />
    </div>

    <!-- How It Works Steps -->
    <section class="ai-stepper-section">
      <div class="container">
        <header class="ai-stepper__header">
          <h2 class="title-xl">How It Works</h2>
          <p class="body-md">
            Four steps to finding your perfect home. No jargon, no fuss—just smart tech doing the hard work.
          </p>
        </header>

        <MoleculesStepper>
          <MoleculesStepperStep :step-number="1" :active="true" variant="blue">
            <h3 class="title-md">Tell us what you want</h3>
            <p class="body-sm">
              "Big windows and a garden" or "somewhere quiet"—speak human, not estate agent.
            </p>
          </MoleculesStepperStep>

          <MoleculesStepperStep :step-number="2" variant="secondary">
            <h3 class="title-md">We do the searching</h3>
            <p class="body-sm">
              Smart tech scans thousands of properties in seconds to find ones that actually match what you said.
            </p>
          </MoleculesStepperStep>

          <MoleculesStepperStep :step-number="3" variant="blue">
            <h3 class="title-md">Get the real story</h3>
            <p class="body-sm">
              Price history, safety stats, school ratings—all the stuff that actually matters, made simple.
            </p>
          </MoleculesStepperStep>

          <MoleculesStepperStep :step-number="4" variant="secondary">
            <h3 class="title-md">Make your move</h3>
            <p class="body-sm">
              Armed with real facts, not marketing fluff. You'll know it's the right choice before you even view.
            </p>
          </MoleculesStepperStep>
        </MoleculesStepper>
      </div>
    </section>

    <!-- Key Features Showcase -->
    <section class="features-showcase section-hero-bg">
      <div class="container">
        <header class="features-showcase__header">
          <h2 class="title-xl">
            Everything you <GradientText>actually</GradientText> need to know
          </h2>
          <p class="max-width-prose body-md">
            No estate agent waffle. Just the real data that helps you make smart decisions about where you'll live.
          </p>
        </header>

        <div class="features-showcase__grid" ref="featuresRef">
          <MoleculesFeatureTile iconName="listings/savings" title="Real prices" subtitle="Up-to-date sale prices"
            description="Skip the guesswork. See what properties actually sold for and spot the trends that matter."
            :class="{ 'animate-in': isFeaturesVisible }" />

          <MoleculesFeatureTile iconName="listings/flood" title="Will it flood?" subtitle="Straight answers about water"
            description="Plain English flood risk info. No confusing maps, just clear answers about staying dry."
            :class="{ 'animate-in': isFeaturesVisible }" />

          <MoleculesFeatureTile iconName="listings/eco" title="Bills and broadband" subtitle="What you'll actually pay"
            description="Energy costs, council tax, broadband speeds. The boring but important stuff, made simple."
            :class="{ 'animate-in': isFeaturesVisible }" />

          <MoleculesFeatureTile iconName="property/security" title="How safe is it?"
            subtitle="Real safety, not scare stories"
            description="Honest crime stats without the drama. Know what's actually happening in your potential neighbourhood."
            :class="{ 'animate-in': isFeaturesVisible }" />

          <MoleculesFeatureTile iconName="explore/map" title="Getting around" subtitle="Your actual commute time"
            description="Tube delays, bus routes, walking times. How you'll really get to work, not the marketing version."
            :class="{ 'animate-in': isFeaturesVisible }" />

          <MoleculesFeatureTile iconName="amenities/school" title="Local schools"
            subtitle="Education without the stress"
            description="Good schools nearby? We'll show you Ofsted ratings and catchment areas in plain English."
            :class="{ 'animate-in': isFeaturesVisible }" />
        </div>
      </div>
    </section>

    <!-- Why People Love Virify Section -->
    <section class="why-virify">
      <div class="container">
        <header class="why-virify__header">
          <h2 class="title-xl">Why Virify?</h2>
          <p class="body-md max-width-prose section-subtitle">
            Property hunting shouldn't be painful. We're here to make it actually helpful (and maybe even enjoyable).
          </p>
        </header>

        <div class="why-virify__highlights" ref="highlightsRef">
          <div class="why-virify__highlight why-virify__highlight--left" :class="{ 'animate-in': isVisible }">
            <div class="why-virify__image">
              <AtomsIcon icon="ai/star" :size="48" />
            </div>
            <div class="why-virify__content">
              <h3 class="title-sm">Plain English, always</h3>
              <p class="r-body-md-sm">
                No estate agent speak. Complex stuff made simple so you actually understand what you're looking at.
              </p>
            </div>
          </div>

          <div class="why-virify__highlight why-virify__highlight--right" :class="{ 'animate-in': isVisible }">
            <div class="why-virify__content">
              <h3 class="title-md">Smart, not flashy</h3>
              <p class="r-body-md-sm">
                Tech that actually works for you. Fast searches, real insights, zero hassle.
              </p>
            </div>
            <div class="why-virify__image">
              <AtomsIcon icon="explore/ai" :size="40" />
            </div>
          </div>

          <div class="why-virify__highlight why-virify__highlight--left" :class="{ 'animate-in': isVisible }">
            <div class="why-virify__image">
              <AtomsIcon icon="account/chat" :size="48" />
            </div>
            <div class="why-virify__content">
              <h3 class="title-md">Humans when you need them</h3>
              <p class="body-md">
                Real support from real people. No chatbots pretending to understand your house-hunting stress.
              </p>
            </div>
          </div>

          <div class="why-virify__highlight why-virify__highlight--right" :class="{ 'animate-in': isVisible }">
            <div class="why-virify__content">
              <h3 class="title-md">Your data, your business</h3>
              <p class="body-md">
                We don't sell your info or spam you with calls. Your search stays private, full stop.
              </p>
            </div>
            <div class="why-virify__image">
              <AtomsIcon icon="property/security" :size="48" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Signals / Stats -->
    <section class="trust-signals section-hero-bg">
      <div class="container">
        <header class="trust-signals__header">
          <h2 class="title-xl">The <GradientText>numbers</GradientText> don't lie</h2>
          <p class="body-md max-width-prose section-subtitle section-subtitle--large">
            Thousands of people have already ditched the estate agent spin for straight answers.
            Here's what we're building together.
          </p>
        </header>

        <div class="trust-signals__cards" ref="statsCardsRef">
          <AtomsStatsCard value="50,000+" subtitle="Properties checked" title="Data We've Crunched"
            :class="{ 'animate-in': isStatsVisible }" />
          <AtomsStatsCard value="15+" subtitle="Data sources" title="Where We Get Info"
            :class="{ 'animate-in': isStatsVisible }" />
          <AtomsStatsCard value="10,000+" subtitle="People helped" title="Happy House Hunters"
            :class="{ 'animate-in': isStatsVisible }" />
          <AtomsStatsCard value="<1s" subtitle="Average search time" title="Speed That Matters"
            :class="{ 'animate-in': isStatsVisible }" />
          <AtomsStatsCard value="5M+" subtitle="Sale records" title="Real Price Data"
            :class="{ 'animate-in': isStatsVisible }" />
          <AtomsStatsCard value="100%" subtitle="Privacy compliant" title="Your Data Is Safe"
            :class="{ 'animate-in': isStatsVisible }" />
          <AtomsStatsCard value="24/7" subtitle="Human support" title="When You Need Help"
            :class="{ 'animate-in': isStatsVisible }" />
          <AtomsStatsCard value="99.9%" subtitle="Data accuracy" title="Getting It Right"
            :class="{ 'animate-in': isStatsVisible }" />
        </div>
      </div>
    </section>

    <!-- Listing Advert -->
    <section>
      <div class="container">
        <div class="listing-advert">
          <MoleculesListingAdvert />
        </div>
      </div>
    </section>

    <div class="container">
      <OrganismsRelevantListings type="trending" title="Trending" :days="7" :limit="10" />
    </div>

  </div>
</template>
<script setup>
import GradientText from '~/components/atoms/GradientText.vue';
import { useIntersectionObserver } from '@vueuse/core';

// Page metadata
useHead({
  title: 'AI Property Search - Find Your Perfect Home',
  meta: [
    { name: 'description', content: 'Revolutionary AI-powered property search. Simply describe your ideal home and let our intelligent system find perfect matches using natural language processing.' }
  ]
})

// Handle suggestion clicks from hero component
const handleSuggestionSelect = (suggestion) => {
  // Navigate to the AI search page with the suggestion as a query parameter
  navigateTo(`/ai-search?q=${encodeURIComponent(suggestion)}`)
}

// Intersection observer wrapper function
const createIntersectionObserver = () => {
  const elementRef = ref(null)
  const isVisible = ref(false)

  useIntersectionObserver(elementRef, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isVisible.value = true
    }
  }, { threshold: 0.3 })

  return { elementRef, isVisible }
}

// Create observers for each section
const { elementRef: highlightsRef, isVisible } = createIntersectionObserver()
const { elementRef: featuresRef, isVisible: isFeaturesVisible } = createIntersectionObserver()
const { elementRef: statsCardsRef, isVisible: isStatsVisible } = createIntersectionObserver()

</script>

<style scoped lang="scss">
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

// Full-width hero-style background for alternating sections
.section-hero-bg {
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);

  color: var(--monochrome-900);
  margin: var(--size-60) 0;
  padding: 100px 0;

  @media (max-width: 900px) {
    padding: 80px 0;
  }
}

// Centered content with max width
.max-width-prose {
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
}

// Section subtitle classes
.section-subtitle {
  margin: 0 auto;
  margin-top: var(--size-12);

  &--large {
    margin-top: var(--size-16);
  }
}

.homepage {

  @include mq.mobile-only {
    padding-top: var(--size-16);
  }
}

// Default section spacing
section {
  margin: calc(var(--size-72) / 2) 0;
  padding: calc(var(--size-72) / 2) 0;
}

// Stepper section

.ai-stepper-section {
  padding: var(--size-40) 0;
  background: var(--background-100);
}

.ai-stepper__header {
  text-align: center;
  margin-bottom: var(--size-48);
}

// Features Showcase Section

.features-showcase {

  @media (max-width: 900px) {
    padding: 80px 0;
  }

  &__header {
    text-align: center;
    margin-bottom: var(--size-48);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-20);
    margin: 0 auto;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    // Animation styles for feature tiles
    :deep(.feature-tile) {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s ease-out;

      &.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
    }

    // Generate staggered delays for any number of children
    @for $i from 1 through 20 {
      :deep(.feature-tile:nth-child(#{$i})) {
        transition-delay: #{$i * 0.1}s;
      }
    }
  }
}

// Why Virify Section

.why-virify {
  text-align: center;

  &__header {
    margin-bottom: var(--size-40);
  }

  &__highlights {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-32);
    margin-top: var(--size-40);
  }

  &__highlight {
    display: flex;
    align-items: center;
    gap: var(--size-32);
    color: var(--foreground-100);
    border-radius: var(--border-radius-2xl);
    box-shadow: 0 2px 8px 0 rgba(60, 80, 180, 0.04), 0 1.5px 6px 0 rgba(0, 0, 0, 0.02);
    border: 1.5px solid var(--foreground-100);
    padding: var(--size-16);
    transition: all 0.8s ease-out;
    width: 100%;
    max-width: 900px;
    flex-shrink: 0;
    opacity: 0;
    transform: translateY(40px);

    &.animate-in {
      opacity: 1;
      transform: translateY(0);
    }

    &--left {
      align-self: flex-start;
    }

    &--right {
      align-self: flex-end;

      .why-virify__content {
        text-align: right;
        order: 1;
      }

      .why-virify__image {
        order: 2;
      }
    }
  }

  // Generate staggered delays for why-virify highlights
  @for $i from 1 through 10 {
    &__highlight:nth-child(#{$i}) {
      transition-delay: #{$i * 0.2}s;
    }
  }

  &__image {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    background: var(--blue-400);
    border-radius: var(--border-radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;

    .a-icon {
      color: var(--monochrome-900);
    }
  }

  &__content {
    flex: 1;
    text-align: left;

    h3 {
      margin: 0 0 var(--size-12) 0;
    }

    p {
      margin: 0;
    }
  }
}

@media (max-width: 900px) {
  .why-virify {
    &__highlights {
      gap: var(--size-32);
      align-items: stretch;
    }

    &__highlight {
      flex-direction: column;
      text-align: center;
      gap: var(--size-24);
      align-self: stretch;
      max-width: none;
      width: auto;

      &--left,
      &--right {
        align-self: stretch;
      }

      .why-virify__image {
        order: 1;
      }

      .why-virify__content {
        order: 2;
        text-align: center;
      }
    }

    &__content {
      text-align: center;
    }
  }
}
// Trust signals
.trust-signals {
  text-align: center;

  &__header {
    margin-bottom: var(--size-48);
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--size-16);

    @media (min-width: 768px) {
      gap: var(--size-20);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
      gap: var(--size-24);
    }
  }
}
</style>
