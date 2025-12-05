<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="container">
        <div class="contact-hero__content">
          <h1 class="contact-hero__title | title-2xl lineheight-xs">
            <template v-for="(part, index) in parseGradientTextParts(cmsContent?.hero.title || '')" :key="index">
              <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
              <template v-else>{{ part.text }}</template>
            </template>
          </h1>
          <p class="contact-hero__subtitle | body-lg">{{ cmsContent?.hero.subtitle }}</p>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact-form-section" id="contact">
      <div class="container">
        <OrganismsContactForm :title="cmsContent?.formSection.title || ''" :description="cmsContent?.formSection.description || ''" form-type="enquiry" form-id="enquiry" />
      </div>
    </section>

    <!-- Interested Section -->
    <MoleculesCtaSection :title="cmsContent?.interestedSection.title || ''" :description="cmsContent?.interestedSection.description || ''" :buttonText="cmsContent?.interestedSection.buttonText || ''" to="/" :gradient="true" />

    <!-- Press Enquiry Section -->
    <section class="contact-form-section" id="press">
      <div class="container">
        <OrganismsContactForm :title="cmsContent?.pressFormSection.title || ''" :description="cmsContent?.pressFormSection.description || ''" form-type="press" form-id="press" />
      </div>
    </section>

    <!-- Partner Section -->
    <MoleculesCtaSection v-if="cmsContent?.partnerSection" :title="cmsContent?.partnerSection.title || ''" :description="cmsContent?.partnerSection.description || ''" :buttonText="cmsContent?.partnerSection.buttonText || ''" @click="scrollToForm" />

    <!-- FAQ Section -->
    <section class="contact-faq section-gradient-bg">
      <div class="container">
        <h2 class="contact-faq__title | title-xl">
          <template v-for="(part, index) in parseGradientTextParts(cmsContent?.faqSection.title || '')" :key="index">
            <span v-if="part.isGradient" class="gradient-text">{{ part.text }}</span>
            <template v-else>{{ part.text }}</template>
          </template>
        </h2>
        <OrganismsFaq :items="cmsContent?.faqSection.faqs || []" :description="cmsContent?.faqSection.description || ''" />
      </div>
    </section>

    <!-- Guides Section -->
    <section class="contact-guides">
      <div class="container">
        <h2 class="contact-guides__title | title-xl">
          <template v-for="(part, index) in parseGradientTextParts(cmsContent?.guidesSection?.title || '')" :key="index">
            <span v-if="part.isGradient" class="gradient-text-light">{{ part.text }}</span>
            <template v-else>{{ part.text }}</template>
          </template>
        </h2>
        <p class="contact-guides__description | body-lg">{{ cmsContent?.guidesSection?.description || "" }}</p>
        <OrganismsGuidesCarousel v-if="cmsContent?.guidesSection" :guides="cmsContent.guidesSection.guides" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Fetch CMS content
const { data: cmsContent } = await useSanityQuery<ContactPage>(contactPageQuery);

function scrollToForm() {
  const formSection = document.getElementById("contact");
  if (formSection) {
    formSection.scrollIntoView({ behavior: "smooth" });
  }
}

// SEO metadata
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
  ogUrl: "https://virify.co.uk/contact",
  twitterCard: seoData.value.twitterCard as "summary" | "summary_large_image",
});

useHead({
  link: [{ rel: "canonical", href: seoData.value.canonicalUrl }],
  script: [
    {
      src: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
      async: true,
      defer: true,
    },
  ],
});

// Structured data
useSchemaOrg([
  {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://virify.co.uk" },
      { "@type": "ListItem", position: 2, name: "Contact", item: "https://virify.co.uk/contact" },
    ],
  },
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
.contact-hero {
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
.contact-form-section {
  padding: var(--size-64) 0;
}

.contact-faq {
  padding: var(--size-120) 0;

  &__title {
    text-align: center;
    padding-bottom: var(--size-16);
  }
}

.contact-guides {
  padding: var(--size-120) 0;

  &__title {
    text-align: center;
    margin-bottom: var(--size-16);
  }

  &__description {
    text-align: center;
    margin: 0 auto;
    max-width: 600px;
    margin-bottom: var(--size-48);
  }
}
</style>
