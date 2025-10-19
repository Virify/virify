<template>
  <div class="waiting-list-page">
    <!-- Hero Section -->
    <section class="waiting-list-hero">
      <div class="container">
        <div class="waiting-list-hero__content">
          <h1 class="waiting-list-hero__title | title-2xl lineheight-xs">The <span class="gradient-text">UK's</span> first <span
              class="gradient-text">open</span> property marketplace</h1>
          <p class="waiting-list-hero__subtitle | body-lg">Market privately, search with AI, and connect directly with sellers and landlords. Save time, cut costs, take control.</p>
        </div>
      </div>
    </section>

    <!-- Sign Up Form Section -->
    <section class="waiting-list-form-section">
      <div class="container">
        <div class="waiting-list-form-container">
          <h2 class="waiting-list-form__title | title-md">Get early access</h2>
          <p class="waiting-list-form__description | body-md">Whether you’re looking for your next home, ready to market privately, or an estate agent looking for a more cost-effective and easy-to-use platform, join our waiting list for exclusive early access and progress updates.</p>

          <form @submit.prevent="handleSubmit" class="waiting-list-form">
            <div v-if="formError" class="waiting-list-form__error">
              {{ formError }}
            </div>

            <div class="waiting-list-form__input-group">
              <div class="waiting-list-form__input-wrapper">
                <label for="email" class="waiting-list-form__label | body-sm"> Email address </label>
                <div class="waiting-list-form__input-button-group">
                  <div class="waiting-list-form__input">
                    <AtomsInput id="email" v-model="email" type="email" name="email"
                      placeholder="your.email@example.com" required :disabled="isSubmitting || isSuccess" />
                  </div>
                  <div class="waiting-list-form__submit">
                    <AtomsButton v-if="!isSuccess" class="waiting-list-form__submit-button | button-monochrome"
                      type="submit" :pending="isSubmitting" :disabled="!agreedToTerms || !email"> Join Waiting List
                    </AtomsButton>
                  </div>
                </div>
              </div>
            </div>

            <div class="waiting-list-form__checkbox">
              <label class="waiting-list-form__checkbox-label | body-sm">
                <input type="checkbox" v-model="agreedToTerms" class="waiting-list-form__checkbox-input"
                  :disabled="isSubmitting || isSuccess" required />
                <span class="waiting-list-form__checkbox-text">
                  I agree to the
                  <NuxtLink to="/terms" class="link">Terms & Conditions</NuxtLink>
                  and
                  <NuxtLink to="/privacy" class="link">Privacy Policy</NuxtLink>
                </span>
              </label>
            </div>

            <div class="waiting-list-form__success" v-if="isSuccess">
              <AtomsIcon icon="tick" :size="48" class="waiting-list-form__success-icon" />
              <h3 class="title-sm">You're on the list!</h3>
              <p class="body-sm">{{ message }}</p>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- What We're Building Section (Buyers) -->
    <section class="waiting-list-features">
      <div class="container">
        <header class="waiting-list-features__header">
          <h2 class="title-xl">For <span class="gradient-text">smart home seekers</span></h2>
          <p class="body-md max-width-prose section-subtitle">We're building the property search platform we wish
            existed. AI-powered, data-driven, and brutally honest about what you're actually getting.</p>
        </header>

        <div class="waiting-list-features__grid" ref="buyersRef">
          <MoleculesFeatureTile iconName="ai/prompt" title="AI-Powered Search" subtitle="Tell us in plain English"
            description='"Big garden and quiet street" beats ticking 50 boxes. Our AI understands what you actually mean and finds properties that match.'
            :class="{ 'animate-in': isBuyersVisible }" />

          <MoleculesFeatureTile iconName="listings/savings" title="Real Data, No Spin" subtitle="Facts in one place"
            description="Actual sale prices, genuine crime stats, honest flood risks. We do the leg work and pull all the data into one place."
            :class="{ 'animate-in': isBuyersVisible }" />

          <MoleculesFeatureTile iconName="explore/map" title="Map-Based Searching" subtitle="Draw your perfect area"
            description="Draw your perfect area on a map. See everything available at once. No more clicking through hundreds of listings one by one."
            :class="{ 'animate-in': isBuyersVisible }" />

          <MoleculesFeatureTile iconName="amenities/school" title="Neighbourhood Insights"
            subtitle="What it's like to live there"
            description="Schools, transport, broadband speeds, energy costs. All the crucial stuff you need to make a decision on your next home."
            :class="{ 'animate-in': isBuyersVisible }" />

          <MoleculesFeatureTile iconName="listings/eco" title="Running Costs" subtitle="Bills before you commit"
            description="From energy ratings, council tax bands and utilities, see how much the bills currently cost, and estimate your outgoings."
            :class="{ 'animate-in': isBuyersVisible }" />

          <MoleculesFeatureTile iconName="property/security" title="Deal Direct with Owners"
            subtitle="Virified private listings, no middlemen"
            description="Connect directly with real people and get the detail from the people who actually own the place, without the marketing spin."
            :class="{ 'animate-in': isBuyersVisible }" />
        </div>
      </div>
    </section>

    <!-- For Sellers Section -->
    <section class="waiting-list-sellers">
      <div class="container">
        <header class="waiting-list-sellers__header">
          <h2 class="title-xl">Market <span class="gradient-text">smarter</span>, keep <span class="gradient-text">more</span></h2>
          <p class="body-md max-width-prose section-subtitle">Create your own listing and connect directly with home seekers. Take control, manage your process and save costs.</p>
        </header>

        <div class="waiting-list-sellers__grid" ref="sellersRef">
          <MoleculesFeatureTile iconName="listings/savings" title="Keep more of your money" subtitle="No commission, no hidden costs"
            description="Clear, up-front and low-costs. Sounds good? Market on Virify."
            variant="blue" :class="{ 'animate-in': isSellersVisible }" />

          <MoleculesFeatureTile iconName="cards/verified" title="Take control" subtitle="Your listing, your style"
            description="Our personalised dashboard provides you with all the easy-to-use tools you need to market your property at your own pace."
            :class="{ 'animate-in': isSellersVisible }" variant="blue" />

          <MoleculesFeatureTile iconName="account/chat" title="Direct messaging"
            subtitle="Messages without the middlemen"
            description="Message users directly through our secure platform. Arrange viewings and discuss offers on your terms."
            :class="{ 'animate-in': isSellersVisible }" variant="blue" />

          <MoleculesFeatureTile iconName="ai/edit" title="Easy Listing Creation" subtitle="Guided and intuitive creation"
            description="Our guided form makes listing simple. Add photos and details in minutes."
            :class="{ 'animate-in': isSellersVisible }" variant="blue" />

          <MoleculesFeatureTile iconName="explore/ai" title="AI-Powered Matching" subtitle="Be matched to the right person for your home using our AI-powered search."
            description="Be matched to the right person for your home using our AI-powered search."
            :class="{ 'animate-in': isSellersVisible }" variant="blue" />

          <MoleculesFeatureTile iconName="content/info" title="Support & Guidance"
            subtitle="From thinking about marketing to accepting an offer"
            description="First time marketing without an estate agent? Our guides and easy-to-use platform gives you all the tools you need."
            :class="{ 'animate-in': isSellersVisible }" variant="blue" />
        </div>
      </div>
    </section>

    <!-- Why Early Access Section -->
    <section class="waiting-list-benefits">
      <div class="container">
        <header class="waiting-list-benefits__header">
          <h2 class="title-xl">Get <span class="gradient-text">ahead</span> before everyone else</h2>
          <p class="body-md max-width-prose section-subtitle">Get first access to a smarter way to buy and sell property, powered by AI, built by real people who’ve had enough of the old way.</p>
        </header>

        <div class="waiting-list-benefits__cards">
          <AtomsHeroCard>
            <h3 class="title-md gradient-text">Be First In</h3>
            <p class="body-md">Get early access before launch. Be amongst the first to search with AI or list your property privately in the UK.</p>
          </AtomsHeroCard>

          <AtomsHeroCard variant="secondary">
            <h3 class="title-md">Insider Perks</h3>
            <p class="body-md">Founding members get reduced fees and first access to our AI-powered tools.</p>
          </AtomsHeroCard>

          <AtomsHeroCard>
            <h3 class="title-md gradient-text">Direct Influence</h3>
            <p class="body-md">Your feedback shapes our next features, from smarter search filters to better pricing tools.</p>
          </AtomsHeroCard>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="waiting-list-final-cta">
      <div class="container">
        <div class="waiting-list-final-cta__content">
          <h2 class="title-xl">Ready to market the <span class="gradient-text">new way?</span></h2>
          <p class="body-lg max-width-prose">Join thousands who are ready for honest property searching and direct private listings. Whether you’re buying, selling, leasing or renting, Virify puts you in control.</p>
          <AtomsButton @click="scrollToForm" class="waiting-list-final-cta__button | button-lg button-monochrome"> Join
            the Waiting List </AtomsButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
const { showToast } = useToast();
// Gradient text is used via AtomsGradientText auto-registered component
const email = ref("");
const agreedToTerms = ref(false);
const isSubmitting = ref(false);
const isSuccess = ref(false);
const formError = ref<string | null>(null);
const message = ref("You're on the list! Check your email for confirmation.");

// Intersection Observer helper (mirrors homepage pattern)
const createIntersectionObserver = () => {
  const elementRef = ref<HTMLElement | null>(null);
  const isVisible = ref(false);

  useIntersectionObserver(
    elementRef,
    (entries) => {
      const [entry] = entries;
      if (entry && entry.isIntersecting) {
        isVisible.value = true;
      }
    },
    { threshold: 0.3 }
  );

  return { elementRef, isVisible };
};

// Buyers (Searchers) grid
const { elementRef: buyersRef, isVisible: isBuyersVisible } = createIntersectionObserver();
// Sellers grid
const { elementRef: sellersRef, isVisible: isSellersVisible } = createIntersectionObserver();

async function handleSubmit() {
  if (!email.value || !agreedToTerms.value) {
    formError.value = "Please complete all required fields";
    return;
  }

  isSubmitting.value = true;
  formError.value = null;

  try {
    const response = await $fetch<{ success: boolean; message: string; alreadyExists?: boolean }>("/api/waiting-list", {
      method: "POST",
      body: {
        email: email.value,
      },
    });

    if (response.success) {
      isSuccess.value = true;
      message.value = response.message;
      showToast(message.value, { type: "success" });
    }
  } catch (error: any) {
    console.error("Waiting list signup error:", error);
    formError.value = error.data?.statusMessage || "Failed to join waiting list. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
}

function scrollToForm() {
  const formSection = document.querySelector(".waiting-list-form-section");
  if (formSection) {
    formSection.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// SEO - Nuxt SEO auto-generates WebPage schema from this
useSeoMeta({
  title: 'Join Virify Waiting List - The UK\'s First Open Property Marketplace',
  description: 'Get early access to Virify, an AI-powered property search with real data, map-based searching, and direct connections to sellers and landlords. Whether you\'re ready to market privately or an estate agent looking for a more cost-effective solution, Virify has you covered.',
  keywords: 'property portal, property sales, buy property, rent property, sell property, property marketplace UK, AI property search, sell without estate agent, private property listings, buy direct from owner, map-based property search, UK property platform, estate agent alternative',
  ogTitle: 'Join Virify Waiting List - The UK\'s First Open Property Marketplace',
  ogDescription: 'Market privately, search with AI, and connect directly. Save time, cut costs, take control of your property journey.',
  ogType: 'website',
  ogUrl: 'https://virify.co.uk/waiting-list',
  twitterCard: 'summary_large_image',
});

useHead({
  link: [
    { rel: 'canonical', href: 'https://virify.co.uk/waiting-list' }
  ],
});

// Custom breadcrumbs
useSchemaOrg([
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://virify.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Waiting List', item: 'https://virify.co.uk/waiting-list' }
    ]
  }
]);

</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;

// Shared gradient background
.section-gradient-bg {
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  color: var(--monochrome-900);
}

// Hero Section
.waiting-list-hero {
  @extend .section-gradient-bg;
  padding: var(--size-80) var(--size-32) var(--size-64);
  min-height: 45vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @include mq.tablet {
    padding: var(--size-32);
    background:
      url("/img/logo-background.svg") no-repeat top right,
      linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
    background-size:
      auto 120%,
      cover;
  }

  &__content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  &__title {
    margin-bottom: var(--size-24);
  }

  &__subtitle {
    margin: 0 auto;
  }
}

// Form Section
.waiting-list-form-section {
  padding: var(--size-64) 0;
}

.waiting-list-form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--size-48);

  @include mq.mobile-only {
    padding: 0;
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

  &__input-wrapper {
    max-width: 800px;
    margin: 0 auto var(--size-20);
  }

  &__label {
    display: block;
    margin-bottom: var(--size-8);
  }

  &__input-button-group {
    display: flex;
    gap: var(--size-12);
    align-items: flex-start;

    @include mq.mobile-only {
      flex-direction: column;
    }
  }

  &__input {
    flex: 1;
    width: 100%;
  }

  &__submit {
    align-self: flex-start;

    @include mq.mobile-only {
      align-self: stretch;
    }
  }

  &__submit-button {
    flex-shrink: 0;
    white-space: nowrap;
    padding: var(--size-12) var(--size-24);

    @include mq.mobile-only {
      width: 100%;
    }
  }

  &__checkbox {
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
    border-radius: var(--border-radius-lg);
    margin-top: var(--size-12);

    h3 {
      margin: var(--size-16) 0 var(--size-8);
    }

    p {
      margin: 0;
    }
  }
}

// Shared grid section styles
%section-grid {
  padding: var(--size-120) 0;

  .feature-tile {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;

    &.animate-in {
      opacity: 1;
      transform: translateY(0);
    }

    @for $i from 1 through 6 {
      &:nth-child(#{$i}) {
        transition-delay: #{$i * 0.1}s;
      }
    }
  }
}

%grid-layout {
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

%section-header {
  text-align: center;
  margin-bottom: var(--size-48);

  h2 {
    margin-bottom: var(--size-16);
  }
}

// Features Section (Buyers)
.waiting-list-features {
  @extend .section-gradient-bg;
  @extend %section-grid;

  &__header {
    @extend %section-header;
  }

  &__grid {
    @extend %grid-layout;
  }
}

// Sellers Section
.waiting-list-sellers {
  @extend %section-grid;

  &__header {
    @extend %section-header;
  }

  &__grid {
    @extend %grid-layout;
  }
}

// Benefits Section
.waiting-list-benefits {
  @extend .section-gradient-bg;
  padding: var(--size-120) 0;

  &__header {
    text-align: center;
    margin-bottom: var(--size-48);
  }

  &__cards {
    @extend %grid-layout;
    max-width: 1200px;
    margin: 0 auto;
    gap: var(--size-24);

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
  padding: var(--size-120) 0;

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

// Utility classes
.max-width-prose {
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
}

.section-subtitle {
  margin: var(--size-12) auto 0;
}
</style>
