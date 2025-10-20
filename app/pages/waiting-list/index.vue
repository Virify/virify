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
              <template v-else>{{ part.text }}</template>
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
    <!-- BUYERS BENEFITS SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-features">
      <div class="container">
        <header class="waiting-list-features__header">
          <h2 class="title-xl">
            <template v-for="(part, index) in parseGradientTextParts(cmsContent?.buyersBenefits.title || '')" :key="index">
              <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
              <template v-else>{{ part.text }}</template>
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
            :class="{ 'animate-in': isBuyersVisible }" />
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- SELLERS BENEFITS SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-sellers">
      <div class="container">
        <header class="waiting-list-sellers__header">
          <h2 class="title-xl">
            <template v-for="(part, index) in parseGradientTextParts(cmsContent?.sellersBenefits.title || '')" :key="index">
              <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
              <template v-else>{{ part.text }}</template>
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
            variant="blue" 
            :class="{ 'animate-in': isSellersVisible }" />
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- EARLY ACCESS BENEFITS SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-benefits">
      <div class="container">
        <header class="waiting-list-benefits__header">
          <h2 class="title-xl">
            <template v-for="(part, index) in parseGradientTextParts(cmsContent?.earlyAccessBenefits.title || '')" :key="index">
              <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
              <template v-else>{{ part.text }}</template>
            </template>
          </h2>
          <p class="body-md max-width-prose section-subtitle">{{ cmsContent?.earlyAccessBenefits.subtitle }}</p>
        </header>

        <div class="waiting-list-benefits__cards">
          <AtomsHeroCard v-for="(benefit, index) in cmsContent?.earlyAccessBenefits.benefits" :key="index" :variant="index === 1 ? 'secondary' : undefined">
            <h3 class="title-md">
              <template v-for="(part, pIndex) in parseGradientTextParts(benefit.title || '')" :key="pIndex">
                <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
                <template v-else>{{ part.text }}</template>
              </template>
            </h3>
            <p class="body-md">{{ benefit.description }}</p>
          </AtomsHeroCard>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- CONTACT SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-contact">
      <div class="container">
        <div class="waiting-list-contact__content">
          <h2 class="title-xl">
            <template v-for="(part, index) in parseGradientTextParts(cmsContent?.contactSection.title || '')" :key="index">
              <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
              <template v-else>{{ part.text }}</template>
            </template>
          </h2>
          <p class="body-lg max-width-prose">{{ cmsContent?.contactSection.description }}</p>
          <div class="waiting-list-contact__button-wrapper">
            <nuxt-link to="/contact" class="button button-lg button-monochrome">
              {{ cmsContent?.contactSection.buttonText }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- FINAL CTA SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-final-cta">
      <div class="container">
        <div class="waiting-list-final-cta__content">
          <h2 class="title-xl">
            <template v-for="(part, index) in parseGradientTextParts(cmsContent?.finalCta.title || '')" :key="index">
              <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
              <template v-else>{{ part.text }}</template>
            </template>
          </h2>
          <p class="body-lg max-width-prose">{{ cmsContent?.finalCta.description }}</p>
          <AtomsButton @click="scrollToForm" class="waiting-list-final-cta__button | button-lg button-monochrome"> 
            {{ cmsContent?.finalCta.buttonText }}
          </AtomsButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
const { showToast } = useToast();

// Fetch CMS content with fallback
const { useWaitingListPage } = useSanity();
const { data: cmsContent } = await useWaitingListPage();

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
  ogImage: seoData.value.ogImage,
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

// Contact Section
.waiting-list-contact {
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

  &__button-wrapper {
    display: flex;
    justify-content: center;
  }
}

// Final CTA Section
.waiting-list-final-cta {
  @extend .section-gradient-bg;
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
