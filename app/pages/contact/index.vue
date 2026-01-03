<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <OrganismsHero
      :title="cmsContent?.hero.title || ''"
      :subtitle="cmsContent?.hero.subtitle || ''"
    />

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
          <AtomsGradientTextRenderer :text="cmsContent?.faqSection.title || ''" variant="dark" />
        </h2>
        <OrganismsFaq :items="cmsContent?.faqSection.faqs || []" :description="cmsContent?.faqSection.description || ''" />
      </div>
    </section>

    <!-- Guides Section -->
    <OrganismsGuideSection
      v-if="cmsContent?.guidesSection"
      :title="cmsContent.guidesSection.title"
      :description="cmsContent.guidesSection.description || ''"
      :guides="cmsContent.guidesSection.guides"
      :gradient-class="'gradient-text-light'"
    />
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
@use "#styles/3-elements/sections" as *;

// Shared gradient background
.section-gradient-bg {
  @include section-gradient-bg();
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
