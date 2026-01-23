<template>
  <div class="waiting-list-page">
    <UPageHero
      :title="cmsContent?.hero.title || 'Join the waiting list'"
      :description="
        cmsContent?.hero.subtitle ||
        'Virify makes property search and marketing simple for everyone. With simple tools and smart, natural-language search with advanced filters to help you find exactly what you need.'
      "
      headline="Join the waiting list"
      :orientation="isWaitingListMode ? 'horizontal' : 'vertical'"
      :ui="{
        root: 'hero-gradient-bg',
        headline: 'text-secondary',
        title: 'title-2xl text-white!',
        description: 'text-white body-lg',
      }"
    >
      <div
        v-if="isWaitingListMode"
        class="flex justify-center items-center w-full px-4 sm:px-6"
      >
        <MoleculesImageSwap
          front-image="/img/natural_lang.png"
          back-image="/img/traditional.png"
          front-label="Natural Language"
          back-label="Traditional Search"
          class="w-full max-w-2xl"
        />
      </div>
      <div v-else class="max-w-200 w-full m-auto">
        <OrganismsDockBanner listingType="all" />
      </div>
    </UPageHero>

    <!-- ============================================ -->
    <!-- SIGN UP FORM SECTION -->
    <!-- ============================================ -->
    <section class="waiting-list-form-section">
      <div class="container">
        <div class="waiting-list-form__header">
          <h2 class="waiting-list-form__title | title-md">
            {{ cmsContent?.formSection.title }}
          </h2>
          <p class="waiting-list-form__description | body-md">
            {{ cmsContent?.formSection.description }}
          </p>

          <form @submit.prevent="handleSubmit" class="waiting-list-form">
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
                    <ClientOnly>
                      <AtomsInput
                        id="email"
                        v-model="email"
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        required
                        :disabled="isSubmitting || isSuccess"
                        error-id="email-error"
                      />
                    </ClientOnly>
                  </div>
                  <div class="waiting-list-form__submit">
                    <AtomsButton
                      v-if="!isSuccess"
                      class="waiting-list-form__submit-button | button-monochrome"
                      type="submit"
                      :pending="isSubmitting"
                      :disabled="!agreedToTerms || !email"
                    >
                      {{ cmsContent?.formSection.buttonText }}
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
                  <NuxtLink to="/terms" class="link"
                    >Terms & Conditions</NuxtLink
                  >
                  and
                  <NuxtLink to="/privacy" class="link">Privacy Policy</NuxtLink>
                </span>
              </label>
            </div>

            <div class="waiting-list-form__success" v-if="isSuccess">
              <AtomsIcon
                icon="tick"
                :size="48"
                class="waiting-list-form__success-icon"
              />
              <h3 class="title-sm">You're on the list!</h3>
              <p class="body-sm">{{ message }}</p>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Features -->
    <UPageCTA
      v-for="(section, index) in processedFeatureSections"
      orientation="horizontal"
      variant="soft"
      :class="index % 2 === 0 ? 'section-gradient-bg' : ''"
      :reverse="index % 2 !== 0"
      :ui="{
        body: 'border-0 radius-0',
        root: 'rounded-none',
        title: 'text-secondary/90!',
      }"
    >
      <template #title>
        <h2>{{ section.title }}</h2>
      </template>

      <template #description>
        <p class="body-md">
          {{ section.subtitle }}
        </p>
      </template>

      <template #body>
        <div class="flex flex-col gap-4">
          <UPageFeature
            v-for="feature in section.features"
            icon="i-lucide-info"
            :title="feature.title"
            :description="feature.description"
            :ui="{
              description: 'body-sm',
              leadingIcon: 'text-secondary h-6 w-6',
            }"
          >
          </UPageFeature>
        </div>
      </template>

      <AtomsCloudFlareImage
        v-if="section.image"
        :src="section.image"
        :alt="section.imageAlt"
        class="h-auto w-full"
      />
    </UPageCTA>

    <!-- sellers section -->
    <UPageSection
      :title="cmsContent?.sellersBenefits.title || 'What we offer sellers'"
      :description="cmsContent?.sellersBenefits.subtitle || ''"
      headline="Your in control"
      :ui="{
        headline: 'text-secondary/90!',
        body: 'flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6',
      }"
    >
      <template #body>
        <UPageCard
          v-for="(feature, index) in cmsContent?.sellersBenefits.features"
          :key="index"
          :title="feature.title"
          :description="feature.description"
          variant="subtle"
          spotlight
          spotlight-color="primary"
          icon="i-lucide-chart-no-axes-gantt"
          :ui="{
            title: 'text-secondary/90!',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
          }"
        />
      </template>
    </UPageSection>

    <!-- buyers section -->
    <UPageSection
      :title="cmsContent?.buyersBenefits.title || 'What we offer buyers'"
      :description="cmsContent?.buyersBenefits.subtitle || ''"
      headline="Get the best results"
      :ui="{
        root: 'section-gradient-bg',
        headline: 'text-secondary/90!',
        body: 'flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6',
      }"
    >
      <template #body>
        <UPageCard
          v-for="(feature, index) in cmsContent?.buyersBenefits.features"
          :key="index"
          :title="feature.title"
          :description="feature.description"
          variant="subtle"
          spotlight
          spotlight-color="secondary"
          icon="i-lucide-chart-no-axes-gantt"
          :ui="{
            spotlight: 'bg-primary/50!',
            root: 'bg-primary/50! ring-primary/60',
            container: 'border-secondary!',
            title: 'text-secondary/90!',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
          }"
        />
      </template>
    </UPageSection>

    <!-- contact us cta -->
    <UPageCTA
      :title="cmsContent?.contactSection.title"
      :description="cmsContent?.contactSection.description"
      :ui="{
        root: 'rounded-none ring-0',
      }"
      :links="[
        {
          label: cmsContent?.contactSection.buttonText || 'Contact Us',
          to: '/contact',
          color: 'neutral',
          icon: 'i-lucide-mail',
          size: 'xl',
          variant: 'solid',
          class: 'font-bold rounded-full bg-(--monochrome-100) text-(--monochrome-900)! hover:bg-(--blue-500) p-4',
        },
      ]"
    />

    <!-- TODO: REPLACE THE REST OF THIS PAGE -->
    <UPageSection
      :title="cmsContent?.earlyAccessBenefits.title"
      :description="cmsContent?.earlyAccessBenefits.subtitle"
      headline="Early Access Benefits"
      class="section-gradient-bg"
    >
    <template #features>
      <UPageCard
        v-for="(benefit, index) in cmsContent?.earlyAccessBenefits.benefits"
        :key="index"
        icon="i-lucide-info"
        :title="benefit.title"
        :description="benefit.description"
        class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
        :ui="{
            root: 'bg-primary/50! ring-0',
            container: 'shadow-xl',
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
            }"
        >
      </UPageCard>
    </template>
    </UPageSection>

    <!-- guides -->
    <UPageSection
      :title="cmsContent?.guidesSection?.title"
      :description="cmsContent?.guidesSection?.description"
      headline="Helpful Guides"
      :ui="{
        headline: 'text-secondary'
      }"
    >
      <UBlogPosts>
        <UBlogPost
          v-for="(guide, index) in cmsContent?.guidesSection?.guides"
          :key="index"
          variant="subtle"
          :title="guide.title"
          :description="guide.excerpt"
          :to="'guides/' + guide.category.slug.current + '/' + guide.slug.current"
          :badge="'Read Time: ' + guide.readTime + ' mins'"
          :date="guide.publishedAt"
          :authors="[
            { 
              name: 'Virify',
              avatar: {
                alt: 'Virify',
                class: 'border-1'
              }
            }

          ]"
          :image="{
            provider: 'sanity',
            src: guide.heroImage?.asset._ref,
            alt: guide.heroImage?.alt || guide.title
          }"
          :ui="{
            title: 'body-md font-bold',
            meta: 'justify-between',
            description: 'body-sm',
            body: 'justify-evenly',
          }"
        />
      </UBlogPosts>
    </UPageSection>

    <!-- final cta section -->
    <UPageCTA
      :title="cmsContent?.finalCta.title"
      :description="cmsContent?.finalCta.description"
      :ui="{
        root: 'rounded-none ring-0',
      }"
      class="section-gradient-bg"
      :links="[
        {
          label: cmsContent?.finalCta.buttonText || 'Contact Us',
          color: 'neutral',
          icon: 'i-lucide-mail',
          size: 'xl',
          variant: 'solid',
          class: 'font-bold rounded-full bg-(--monochrome-100) text-(--monochrome-900)! hover:bg-(--blue-500) p-4',
        },
      ]"
      @click="scrollToForm"
    />
  </div>
</template>

<script setup lang="ts">
const { isWaitingListMode } = useWaitingListMode();
const toast = useToast();


// Fetch CMS content - module automatically uses correct perspective
const { data: cmsContent, error: cmsError } =
  await useSanityQuery<WaitingListPage>(waitingListPageQuery);

// Process feature sections: clean stega encoding and determine which image props to pass
const processedFeatureSections = computed(() =>
  processFeatureSections(cmsContent.value?.featureSections),
);
// Gradient text is used via AtomsGradientText auto-registered component
const email = ref("");
const agreedToTerms = ref(false);
const isSubmitting = ref(false);
const isSuccess = ref(false);
const formError = ref<string | null>(null);
const message = ref("You're on the list! Check your email for confirmation.");

async function handleSubmit() {
  if (!email.value || !agreedToTerms.value) {
    formError.value = "Please complete all required fields";
    return;
  }

  isSubmitting.value = true;
  formError.value = null;

  try {
    const response = await $fetch<{
      success: boolean;
      message: string;
      alreadyExists?: boolean;
    }>("/api/waiting-list", {
      method: "POST",
      body: {
        email: email.value,
      },
    });

    if (response.success) {
      isSuccess.value = true;
      message.value = response.message;
      toast.add({
        title: "Success",
        description: message.value,
        color: "success",
      });
    }
  } catch (error: any) {
    console.error("Waiting list signup error:", error);
    formError.value =
      error.data?.statusMessage ||
      "Failed to join waiting list. Please try again.";
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
  ogType: "website",
  ogUrl: "https://virify.co.uk",
  twitterCard: seoData.value.twitterCard as "summary" | "summary_large_image",
});

useHead({
  link: [{ rel: "canonical", href: seoData.value.canonicalUrl }],
});

// Custom breadcrumbs
useSchemaOrg([
  {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://virify.co.uk",
      },
    ],
  },
]);
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;
@use "#styles/3-elements/sections" as *;

@mixin hero-gradient() {
  background: linear-gradient(
    135deg,
    var(--blue-400) 50%,
    var(--secondary-400) 150%
  );
}

@mixin hero-background() {
  background:
    url("/img/logo-background.svg") no-repeat top right,
    linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  background-size:
    auto 120%,
    cover;
}

// Shared gradient background
.section-gradient-bg {
  @include section-gradient-bg();
}

.hero-gradient-bg {
  @include hero-gradient();

  @include mq.desktop {
    @include hero-background();
  }
}

// Form Section
.waiting-list-form-section {
  padding: var(--size-120) 0;
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
</style>
