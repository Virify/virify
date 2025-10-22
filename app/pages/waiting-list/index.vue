<template>
  <div class="waiting-list-page">
    
    <!-- ============================================ -->
    <!-- HERO SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-hero">
      <div class="container">
        <div class="waiting-list-hero__content">
          <h1 class="waiting-list-hero__title | title-2xl lineheight-xs">
            <template v-for="(part, index) in parseGradientTextParts(cmsContent?.hero.title || '')" :key="index">
              <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
              <span v-else>{{ part.text }}</span>
            </template>
          </h1>
          <p class="waiting-list-hero__subtitle | body-lg">{{ cmsContent?.hero.subtitle }}</p>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- SIGN UP FORM SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-form-section">
      <div class="container">
        <div class="waiting-list-form-container">
          <h2 class="waiting-list-form__title | title-md">{{ cmsContent?.formSection.title }}</h2>
          <p class="waiting-list-form__description | body-md">{{ cmsContent?.formSection.description }}</p>

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
                      type="submit" :pending="isSubmitting" :disabled="!agreedToTerms || !email"> 
                      {{ cmsContent?.formSection.buttonText }}
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

    <!-- ============================================ -->
    <!-- LOCATION FEATURES SECTION -->
    <!-- ============================================ -->
    <OrganismsFeatureSection
      subtitle="Find your perfect property location with our intelligent search tools"
      :features="locationFeatures"
      image="a9460506-cfd4-4920-3ccb-0b4ba4177800"
      image-position="left"
      background="gradient"
      icon-color="orange"
    >
      <template #title>
        Smart <span class="gradient-text">location search</span>
      </template>
    </OrganismsFeatureSection>

    <!-- ============================================ -->
    <!-- AI SEARCH SECTION -->
    <!-- ============================================ -->
    <OrganismsFeatureSection
      subtitle="Our AI understands what you're really looking for"
      :features="aiSearchFeatures"
      image="ef051198-d10f-480e-8756-90bc25a4ff00"
      image-position="right"
      background="white"
      icon-color="orange"
    >
      <template #title>
        Search in <span class="gradient-text">plain English</span>
      </template>
    </OrganismsFeatureSection>

    <!-- ============================================ -->
    <!-- INTERACTIVE MAP SECTION -->
    <!-- ============================================ -->
    <OrganismsFeatureSection
      subtitle="See everything at a glance with our information-rich map interface"
      :features="mapFeatures"
      image="3e5a8fb9-f943-4d6d-2ab1-e5b76bdc0400"
      image-position="left"
      background="gradient"
      icon-color="orange"
    >
      <template #title>
        <span class="gradient-text">Interactive map</span> experience
      </template>
    </OrganismsFeatureSection>

    <!-- ============================================ -->
    <!-- CHAT FEATURES SECTION -->
    <!-- ============================================ -->
    <OrganismsFeatureSection
      subtitle="Connect instantly with landlords, sellers, buyers, and tenants"
      :features="chatFeatures"
      :overlaid-images="{
        rear: '6c42d57c-fd22-4b93-b29c-54f73eb46600',
        rearAlt: 'Chat conversations list showing multiple property enquiries',
        front: '4e8f13f6-21b8-436b-fc3d-30244a527500',
        frontAlt: 'Active chat conversation with property details and messaging'
      }"
      image-position="right"
      background="white"
      icon-color="orange"
    >
      <template #title>
        Direct <span class="gradient-text">communication</span>
      </template>
    </OrganismsFeatureSection>

    <!-- ============================================ -->
    <!-- SELLERS BENEFITS SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-sellers">
      <div class="container">
        <header class="waiting-list-sellers__header">
          <h2 class="title-xl">
            <template v-for="(part, index) in parseGradientTextParts(cmsContent?.sellersBenefits.title || '')" :key="index">
              <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
              <span v-else>{{ part.text }}</span>
            </template>
          </h2>
          <p class="body-md max-width-prose section-subtitle">{{ cmsContent?.sellersBenefits.subtitle }}</p>
        </header>

        <div class="waiting-list-sellers__grid" ref="sellersRef">
          <MoleculesFeatureTile 
            v-for="(feature, index) in cmsContent?.sellersBenefits.features" 
            :key="index"
            :iconName="feature.icon" 
            :title="feature.title" 
            :subtitle="feature.subtitle"
            :description="feature.description"
            :class="{ 'animate-in': isSellersVisible }" />
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- BUYERS BENEFITS SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-features">
      <div class="container">
        <header class="waiting-list-features__header">
          <h2 class="title-xl">
            <template v-for="(part, index) in parseGradientTextParts(cmsContent?.buyersBenefits.title || '')" :key="index">
              <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
              <span v-else>{{ part.text }}</span>
            </template>
          </h2>
          <p class="body-md max-width-prose section-subtitle">{{ cmsContent?.buyersBenefits.subtitle }}</p>
        </header>

        <div class="waiting-list-features__grid" ref="buyersRef">
          <MoleculesFeatureTile 
            v-for="(feature, index) in cmsContent?.buyersBenefits.features" 
            :key="index"
            :iconName="feature.icon" 
            :title="feature.title" 
            :subtitle="feature.subtitle"
            :description="feature.description"
            variant="blue"
            :class="{ 'animate-in': isBuyersVisible }" />
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- CONTACT SECTION -->
    <!-- ============================================ -->
    <MoleculesCtaSection
      :title="cmsContent?.contactSection.title || ''"
      :description="cmsContent?.contactSection.description || ''"
      :buttonText="cmsContent?.contactSection.buttonText || ''"
      to="/contact"
      gradient
    />

    <!-- ============================================ -->
    <!-- EARLY ACCESS BENEFITS SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-benefits">
      <div class="container">
        <header class="waiting-list-benefits__header">
          <h2 class="title-xl">
            <template v-for="(part, index) in parseGradientTextParts(cmsContent?.earlyAccessBenefits.title || '')" :key="index">
              <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
              <span v-else>{{ part.text }}</span>
            </template>
          </h2>
          <p class="body-md max-width-prose section-subtitle">{{ cmsContent?.earlyAccessBenefits.subtitle }}</p>
        </header>

        <div class="waiting-list-benefits__cards">
          <AtomsHeroCard v-for="(benefit, index) in cmsContent?.earlyAccessBenefits.benefits" :key="index" :variant="index === 1 ? 'secondary' : undefined">
            <h3 class="title-md">
              <template v-for="(part, pIndex) in parseGradientTextParts(benefit.title || '')" :key="pIndex">
                <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
                <span v-else>{{ part.text }}</span>
              </template>
            </h3>
            <p class="body-md">{{ benefit.description }}</p>
          </AtomsHeroCard>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- FINAL CTA SECTION -->
    <!-- ============================================ -->
    <MoleculesCtaSection
      :title="cmsContent?.finalCta.title || ''"
      :description="cmsContent?.finalCta.description || ''"
      :buttonText="cmsContent?.finalCta.buttonText || ''"
      gradient
      @click="scrollToForm"
    />
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";

const { showToast } = useToast();

// Fetch CMS content - module automatically uses correct perspective
const { data: cmsContent } = await useSanityQuery<WaitingListPage>(
  waitingListPageQuery
);

// Feature data for OrganismsFeatureSection components
const locationFeatures = [
  {
    icon: 'search/trending',
    title: 'Trending Locations',
    description: 'Discover the most popular search areas in real-time. See where others are looking to help inform your search.'
  },
  {
    icon: 'search/pin',
    title: 'Saved Locations',
    description: 'Save your favourite search locations for quick access. Never lose track of areas you\'re interested in.'
  },
  {
    icon: 'search/location',
    title: 'Smart Autocomplete',
    description: 'Lightning-fast location suggestions as you type. Find any city, town, or postcode instantly with intelligent search.'
  },
  {
    icon: 'search/history',
    title: 'Search History',
    description: 'Quick access to your recent searches. Jump back to previous locations without typing them again.'
  }
];

const aiSearchFeatures = [
  {
    icon: 'ai/star',
    title: 'Natural Language Search',
    description: 'Type exactly what you want: "2+ bedroom property to buy in Cardiff" and we\'ll understand instantly.'
  },
  {
    icon: 'ai/prompt',
    title: 'Smart Suggestions',
    description: 'Get intelligent property suggestions based on your requirements. See popular searches and trending options as you type.'
  },
  {
    icon: 'search/filter',
    title: 'Contextual Filtering',
    description: 'Our AI automatically extracts location, property type, and transaction type from your search query.'
  },
  {
    icon: 'ai/send',
    title: 'Instant Results',
    description: 'Get relevant property matches in seconds. No complex forms or confusing filters—just type and search.'
  }
];

const mapFeatures = [
  {
    icon: 'map/marker-premium',
    title: 'Photo Markers',
    description: 'View property photos directly on map markers. Get a visual preview before clicking through to full details.'
  },
  {
    icon: 'explore/top-picks',
    title: 'Smart Clustering',
    description: 'Intelligent marker clustering keeps the map clean and organized, even with hundreds of properties.'
  },
  {
    icon: 'cards/favourite',
    title: 'Favourites & Notes',
    description: 'See your saved properties and notes right on the map. Visual indicators show your favourites at a glance.'
  },
  {
    icon: 'explore/map',
    title: 'Search Boundaries',
    description: 'Visual radial and boundary overlays show your search area clearly. Adjust on the fly to refine results.'
  }
];

const chatFeatures = [
  {
    icon: 'account/chat',
    title: 'Direct Messaging',
    description: 'Chat directly with property owners, landlords, and potential buyers or tenants. No intermediaries needed.'
  },
  {
    icon: 'account/notifications',
    title: 'Real-Time Notifications',
    description: 'Get instant notifications for new messages, enquiries, and viewing requests. Never miss an opportunity.'
  },
  {
    icon: 'cards/expand',
    title: 'Rich Media Sharing',
    description: 'Share photos, documents, and listing details within conversations. Everything in one place.'
  },
  {
    icon: 'content/info',
    title: 'Listing Context',
    description: 'See property details, price, and location at a glance within each conversation thread.'
  }
];

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
// Use CMS SEO metadata if available, otherwise fallback to defaults
const seoData = computed(() => {
  const cms = cmsContent.value?.seo;
  
  return {
    title: cms?.metaTitle,
    description: cms?.metaDescription,
    keywords: cms?.keywords,
    ogTitle: cms?.ogTitle,
    ogDescription: cms?.ogDescription,
    ogImage: cms?.ogImage,
    twitterCard: cms?.twitterCard,
    canonicalUrl: cms?.canonicalUrl,
  };
});

useSeoMeta({
  title: seoData.value.title,
  description: seoData.value.description,
  keywords: seoData.value.keywords,
  ogTitle: seoData.value.ogTitle,
  ogDescription: seoData.value.ogDescription,
  ogType: 'website',
  ogUrl: 'https://virify.co.uk/waiting-list',
  twitterCard: seoData.value.twitterCard as 'summary' | 'summary_large_image',
});

useHead({
  link: [
    { rel: 'canonical', href: seoData.value.canonicalUrl }
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
  @extend .section-gradient-bg;

  &__header {
    @extend %section-header;
  }

  &__grid {
    @extend %grid-layout;
  }
}

// Benefits Section
.waiting-list-benefits {
  padding: var(--size-120) 0;
  background: var(--background-100);

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

