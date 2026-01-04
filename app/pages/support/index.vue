<template>
  <div class="p-support">
    <OrganismsHero :title="cmsData.hero.title"
      :subtitle="cmsData.hero.subtitle" />
    <!-- support faq -->
    <section class="p-support__faq section | flow flow-lg">
      <h2 class="p-support__faq--title | title-xl">
        <AtomsGradientTextRenderer :text="cmsData.faqSection.title" variant="light" />
      </h2>
      <OrganismsFaq
        :description="cmsData.faqSection.description"
        :items="cmsData.faqSection.faqs" />
    </section>
    <section class="section-gradient-bg">
      <h2 class="title-xl">
        <AtomsGradientTextRenderer :text="cmsData.ourSupportSection.title" variant="light" />
        <div class="p-support__info | container">
          <AtomsHeroCard
            v-for="(benefit, index) in cmsData.ourSupportSection.benefits"
            :key="index"
            :variant="benefit.variant">
            <h3 class="title-md">
              <AtomsGradientTextRenderer :text="benefit.title" variant="dark" />
            </h3>
            <p class="body-md">{{ benefit.description }}</p>
          </AtomsHeroCard>
        </div>

      </h2>

    </section>
    <!-- Things we cant help with -->
    <section class="p-support__faq section | flow flow-lg">
      <h2 class="p-support__faq--title | title-xl">
        <AtomsGradientTextRenderer :text="cmsData.whatWeDontSupportSection.title" variant="light" />
      </h2>
      <OrganismsFaq
        :description="cmsData.whatWeDontSupportSection.description"
        :items="cmsData.whatWeDontSupportSection.faqs" />
    </section>
    <!-- support form -->
    <section class="p-support__form section-gradient-bg">
      <h2 class="p-support__form--title | title-xl">
        <AtomsGradientTextRenderer :text="cmsData.SupportFormSection.title"
          variant="light" />
      </h2>
      <p class="p-support__form--description | body-lg center-text">{{ cmsData.SupportFormSection.description }}</p>

      <OrganismsFormsSupport />
    </section>
    <section>
      <MoleculesCtaSection
        :title="cmsData.ctaSection.title"
        :description="cmsData.ctaSection.description"
        :buttonText="cmsData.ctaSection.buttonText"
        :to="cmsData.ctaSection.buttonLink"
        />
    </section>
  </div>
</template>
<script lang="ts" setup>

const { data: cmsDataRef } = await useSanityQuery<SupportPage>(supportPageQuery);

// Ensure we have CMS data - throw error if document doesn't exist
if (!cmsDataRef.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Support page content not found in CMS',
  });
}

// Create a non-null version for the template
const cmsData = cmsDataRef.value!;

// SEO metadata
const seoData = computed(() => {
  const cms = cmsData.seo;
  return {
    title: cms?.metaTitle || "Support & Help Center | Virify - Property Search Made Easy",
    description: cms?.metaDescription || "Get help with Virify's property search platform. Access our comprehensive FAQs, guides, and support resources. Contact our support team for assistance with price paid data, waiting list, and more.",
    keywords: cms?.keywords || "property support, help center, FAQ, property guides, UK property data, real estate support",
    ogTitle: cms?.ogTitle || "Support & Help Center | Virify",
    ogDescription: cms?.ogDescription || "Find answers to your questions and get support from the Virify team. Access guides, FAQs, and contact support.",
    ogImage: cms?.ogImage || 'https://virify.co.uk/og-image.jpg',
    twitterCard: cms?.twitterCard || "summary_large_image",
    canonicalUrl: cms?.canonicalUrl || "https://virify.co.uk/support",
  };
});

useSeoMeta({
  title: seoData.value.title,
  description: seoData.value.description,
  keywords: seoData.value.keywords,
  ogTitle: seoData.value.ogTitle,
  ogDescription: seoData.value.ogDescription,
  ogImage: seoData.value.ogImage,
  ogType: "website",
  ogUrl: seoData.value.canonicalUrl,
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
</script>
<style lang="scss" scoped>
@use "#styles/3-elements/sections" as *;

.p-support {
  .section {
    @include section-padding();
  }

  .section-gradient-bg {
    @include section-gradient();
  }

  &__faq {
    &--title {
      text-align: center;
      margin-bottom: var(--size-48);
    }
  }

  &__info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--size-24);
    margin-top: var(--size-48);
    margin-bottom: var(--size-48);
    max-width: 1200px;
    text-align: left;
    font-weight: normal;
  }

  &__form {
    &--title {
      text-align: center;
      margin-bottom: var(--size-16);
    }

    &--description {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 48px auto;
    }
  }
}
</style>
