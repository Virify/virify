<template>
  <div class="p-index">

    <!-- ============================================ -->
    <!-- HERO SECTION -->
    <!-- ============================================ -->
    <div class="p-index__hero">
      <HomepageSectionSignup class="| container" />
    </div>

    <!-- ============================================ -->
    <!-- SIGN UP FORM SECTION -->
    <!-- ============================================ 
    <section class="waiting-list-form-section">
      <div class="container">
        <div class="waiting-list-form__header">
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
                    <ClientOnly>
                      <AtomsInput id="email" v-model="email" type="email" name="email"
                        placeholder="your.email@example.com" required :disabled="isSubmitting || isSuccess"
                        error-id="email-error" />
                    </ClientOnly>
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
    -->

    <!-- ============================================ -->
    <!-- INTRO SECTION -->
    <!-- ============================================ -->
    <HomepageSectionComingSoon class="| container" />

    <!-- ============================================ -->
    <!-- FEATURE SECTIONS (FROM SANITY CMS) -->
    <!-- ============================================ -->
    <a name="homepage-content" aria-hidden></a>

    <OrganismsFeatureSection v-for="(section, index) in processedFeatureSections" :key="index" v-bind="section">
      <template #title>
        <AtomsGradientTextRenderer :text="section.title || ''" :background="section.background || 'white'" />
      </template>
    </OrganismsFeatureSection>

    <!-- ============================================ -->
    <!-- SELLERS BENEFITS SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-sellers" :class="sellersBackground">
      <div class="container">
        <header class="waiting-list-sellers__header">
          <h2 class="title-xl">
            <AtomsGradientTextRenderer :text="cmsContent?.sellersBenefits.title || ''"
              :variant="sellersGradientClass === 'gradient-text-light' ? 'light' : 'dark'" />
          </h2>
          <p class="body-md max-width-prose section-subtitle">{{ cmsContent?.sellersBenefits.subtitle }}</p>
        </header>

        <div class="waiting-list-sellers__grid" ref="sellersRef">
          <MoleculesFeatureTile v-for="(feature, index) in cmsContent?.sellersBenefits.features" :key="index"
            :iconName="feature.icon" :title="feature.title" :subtitle="feature.subtitle"
            :description="feature.description" :variant="sellersVariant" :class="{ 'animate-in': isSellersVisible }" />
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- BUYERS BENEFITS SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-features" :class="buyersBackground">
      <div class="container">
        <header class="waiting-list-sellers__header">
          <h2 class="title-xl">
            <AtomsGradientTextRenderer :text="cmsContent?.buyersBenefits.title || ''"
              :variant="buyersGradientClass === 'gradient-text-light' ? 'light' : 'dark'" />
          </h2>
          <p class="body-md max-width-prose section-subtitle">{{ cmsContent?.buyersBenefits.subtitle }}</p>
        </header>

        <div class="waiting-list-features__grid" ref="buyersRef">
          <MoleculesFeatureTile v-for="(feature, index) in cmsContent?.buyersBenefits.features" :key="index"
            :iconName="feature.icon" :title="feature.title" :subtitle="feature.subtitle"
            :description="feature.description" :variant="buyersVariant" :class="{ 'animate-in': isBuyersVisible }" />
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- CONTACT SECTION -->
    <!-- ============================================ -->
    <MoleculesCtaSection :title="cmsContent?.contactSection.title || ''"
      :description="cmsContent?.contactSection.description || ''"
      :buttonText="cmsContent?.contactSection.buttonText || ''" :gradient="contactGradient" to="/contact" />

    <!-- ============================================ -->
    <!-- EARLY ACCESS BENEFITS SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-benefits" :class="benefitsBackground">
      <div class="container">
        <header class="waiting-list-benefits__header">
          <h2 class="title-xl">
            <AtomsGradientTextRenderer :text="cmsContent?.earlyAccessBenefits.title || ''"
              :variant="benefitsGradientClass === 'gradient-text-light' ? 'light' : 'dark'" />
          </h2>
          <p class="body-md max-width-prose section-subtitle">{{ cmsContent?.earlyAccessBenefits.subtitle }}</p>
        </header>

        <div class="waiting-list-benefits__cards">
          <AtomsHeroCard v-for="(benefit, index) in cmsContent?.earlyAccessBenefits.benefits" :key="index"
            :variant="index === 1 ? 'secondary' : undefined">
            <h3 class="title-md">
              <AtomsGradientTextRenderer :text="benefit.title || ''" variant="dark" />
            </h3>
            <p class="body-md">{{ benefit.description }}</p>
          </AtomsHeroCard>
        </div>
      </div>
    </section>

    <OrganismsGuideSection v-if="cmsContent?.guidesSection" :title="cmsContent.guidesSection.title"
      :description="cmsContent.guidesSection.description || ''" :guides="cmsContent.guidesSection.guides"
      :gradient-class="'gradient-text-light'" />

    <!-- ============================================ -->
    <!-- FINAL CTA SECTION -->
    <!-- ============================================ -->
    <MoleculesCtaSection :title="cmsContent?.finalCta.title || ''" :description="cmsContent?.finalCta.description || ''"
      :buttonText="cmsContent?.finalCta.buttonText || ''" :gradient="true" @click="showSignupForm" />

  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { ViewsDialogWaitingList } from '#components'

/**
 *  Show waiting list form
 */
const { showDialog } = useDialog()

function showSignupForm() {
  showDialog({
    component: ViewsDialogWaitingList
  })
}

// Fetch CMS content - module automatically uses correct perspective
const { data: cmsContent, error: cmsError } = await useSanityQuery<WaitingListPage>(
  waitingListPageQuery
);

// Process feature sections: clean stega encoding and determine which image props to pass
const processedFeatureSections = computed(() =>
  processFeatureSections(cmsContent.value?.featureSections)
);

// Determine if we should alternate backgrounds for remaining sections
// If there are NO CMS feature sections, alternate them; otherwise keep current backgrounds
const hasCmsFeatures = computed(() => processedFeatureSections.value.length > 0);

// Background classes for remaining sections (alternating only if no CMS features)
const sellersBackground = computed(() => hasCmsFeatures.value ? '' : 'section-gradient-bg');
const buyersBackground = computed(() => hasCmsFeatures.value ? 'section-gradient-bg' : '');
const contactGradient = computed(() => !hasCmsFeatures.value); // Boolean for CTA component
const benefitsBackground = computed(() => hasCmsFeatures.value ? 'section-gradient-bg' : '');

// Gradient text classes based on background
const sellersGradientClass = computed(() => hasCmsFeatures.value ? 'gradient-text-light' : 'gradient-text');
const buyersGradientClass = computed(() => hasCmsFeatures.value ? 'gradient-text' : 'gradient-text-light');
const benefitsGradientClass = computed(() => hasCmsFeatures.value ? 'gradient-text' : 'gradient-text-light');

// Variant for feature tiles (blue when no gradient background, default otherwise)
const sellersVariant = computed(() => hasCmsFeatures.value ? 'blue' : undefined);
const buyersVariant = computed(() => hasCmsFeatures.value ? undefined : 'blue');


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
  ogUrl: 'https://virify.co.uk',
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
    ]
  }
]);

</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;
@use "#styles/3-elements/sections" as *;

// Main page styles
.p-index {

  &__hero {
    overflow: hidden;
  }
}

// Shared gradient background
.section-gradient-bg {
  @include section-gradient-bg();
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
