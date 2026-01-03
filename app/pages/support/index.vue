<template>
  <div class="p-support">
    <OrganismsHero :title="heroTitle"
      :subtitle="'Find answers to common questions and get assistance from our support team.'" />
    <!-- support faq -->
    <section class="p-support__faq section | flow flow-lg">
      <h2 class="p-support__faq--title | title-xl">
        <AtomsGradientTextRenderer text="Frequently Asked {gradient}Questions{/gradient}" variant="light" />
      </h2>
      <OrganismsFaq
        description="Here are some of our most frequently asked questions. If you need further assistance, feel free to reach out to our support team."
        :items="supportFaqItems" />
    </section>
    <section class="section-gradient-bg">
      <h2 class="title-xl">
        <AtomsGradientTextRenderer text="Our {gradient}Support{/gradient}" variant="light" />
        <div class="p-support__info | container">
          <AtomsHeroCard>
            <h3 class="title-md">24/7 Support</h3>
            <p class="body-md">Our support team is available around the clock to assist you with any issues or questions
              you may have.</p>
          </AtomsHeroCard>
          <AtomsHeroCard variant="secondary">
            <h3 class="title-md">Expert Assistance</h3>
            <p class="body-md">Our support staff are knowledgeable and experienced, ensuring you receive the best
              possible assistance.</p>
          </AtomsHeroCard>
          <AtomsHeroCard>
            <h3 class="title-md">Comprehensive Resources</h3>
            <p class="body-md">We provide a wide range of resources, including FAQs, guides, and tutorials to help you
              find answers quickly.</p>
          </AtomsHeroCard>
        </div>

      </h2>

    </section>
    <!-- Things we cant help with -->
    <section class="p-support__faq section | flow flow-lg">
      <h2 class="p-support__faq--title | title-xl">
        <AtomsGradientTextRenderer text="Things We {gradient}Can't Help With{/gradient}" variant="light" />
      </h2>
      <OrganismsFaq
        description="Here are some of our most frequently asked questions. If you need further assistance, feel free to reach out to our support team."
        :items="nonSupportFaqItems" />
    </section>
    <!-- support form -->
    <section class="p-support__form section-gradient-bg">
      <h2 class="p-support__form--title | title-xl">
        <AtomsGradientTextRenderer text="Get {gradient}Help{/gradient} and {gradient}Support{/gradient}"
          variant="light" />
      </h2>
      <p class="p-support__form--description | body-lg center-text">Having an issue or need help? Let us know and we'll
        get back to you as soon as possible.</p>

      <OrganismsFormsSupport />
    </section>
    <section>
      <MoleculesCtaSection
        title="Join the {gradient}waiting list{/gradient}"
        description="Be the first to know when we launch. Join our waiting list today!"
        buttonText="Join the waiting list"
        to="/contact"
        />
    </section>
  </div>
</template>
<script lang="ts" setup>

const heroTitle = "{gradient}" + "Help" + "{/gradient}" + " and " + "{gradient}" + " Support" + "{/gradient}";

useSeoMeta({
  title: "Support & Help Center | Virify - Property Search Made Easy",
  description: "Get help with Virify's property search platform. Access our comprehensive FAQs, guides, and support resources. Contact our support team for assistance with price paid data, waiting list, and more.",
  keywords: "property support, help center, FAQ, property guides, UK property data, real estate support",
  ogTitle: "Support & Help Center | Virify",
  ogDescription: "Find answers to your questions and get support from the Virify team. Access guides, FAQs, and contact support.",
  ogType: "website",
  ogUrl: "https://virify.co.uk/support",
  twitterCard: "summary_large_image",
});

useHead({
  link: [{ rel: "canonical", href: "https://virify.co.uk/support" }],
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
