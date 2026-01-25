<template>
  <UPageHero
    :title="cmsData?.hero.title || 'Join the waiting list'"
    :description="
      cmsData?.hero.subtitle ||
      'Virify makes property search and marketing simple for everyone. With simple tools and smart, natural-language search with advanced filters to help you find exactly what you need.'
    "
    headline="Virify Support & Help Center"
    :ui="{
      root: 'hero-background z-2',
      headline: 'text-secondary',
      title: 'title-2xl text-white!',
      description: 'text-white body-lg',
    }"
  />

  <UPageSection
    :title="cmsData.faqSection.title"
    :description="cmsData.faqSection.description"
  >
    <UAccordion
      :items="faqItems"
      :ui="{
        label: 'font-bold title-xs',
        body: 'body-md'
      }"
      class="max-w-175 m-auto"
    />
  </UPageSection>

  <UPageSection
    :title="cmsData?.ourSupportSection.title"
    :description="cmsData?.ourSupportSection.subtitle"
    headline="How we can help you"
    class="section-gradient"
    :ui="{
      headline: 'text-secondary'
    }"
  >
    <template #features>
      <UPageCard
        v-for="(benefit, index) in cmsData?.ourSupportSection.benefits"
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
  
  
  <UPageSection
    :title="cmsData.whatWeDontSupportSection.title"
    :description="cmsData.whatWeDontSupportSection.description"
  >
    <UAccordion
      :items="dontSupportFaqItems"
      :ui="{
        label: 'font-bold title-xs',
        body: 'body-md'
      }"
      class="max-w-175 m-auto"

    />
  </UPageSection>

  <UPageSection
    :title="cmsData?.SupportFormSection.title"
    :description="cmsData?.SupportFormSection.description"
    headline="Contact us"
    :ui="{
      root: 'section-gradient',
      container: 'max-w-180 mx-auto',
      headline: 'text-secondary',
    }"
  >
    <UForm :schema="supportSchema" :state="state" class="flex flex-col gap-4">

      <UFormField
        name="name"
        label="Name"
        required
        :ui="{
          label: 'text-(--monochrome-900)'
        }"
      >
        <UInput 
          v-model="state.name" 
          placeholder="Enter your name"        
          class="w-full" 
          :ui="{
          base: 'p-3 text-(--foreground-100)'
          }"
        />
      </UFormField>

      <UFormField
        name="email"
        label="Email"
        required
        :ui="{
          label: 'text-(--monochrome-900)'
        }"
      >
        <UInput 
          v-model="state.email" 
          placeholder="you@example.com" 
          class="w-full" 
          :ui="{
            base: 'p-3 text-(--foreground-100)',
          }"
        />
      </UFormField>

      <UFormField
        name="subject"
        label="Subject"
        required
        :ui="{
          label: 'text-(--monochrome-900)'
        }"
      >
        <USelect 
          v-model="state.subject" 
          :items="typeOptions" 
          placeholder="Select subject type" 
          class="w-full" 
          :ui="{
            base: 'p-3 text-(--foreground-100)',
            trailingIcon: 'text-(--foreground-100)',
          }"
        />
      </UFormField>

      <UFormField
        name="details"
        label="Details"
        required
        :ui="{
          label: 'text-(--monochrome-900)'
        }"
      >
        <UTextarea 
          v-model="state.details" 
          placeholder="Enter your message" 
          class="w-full" 
          :ui="{
            base: 'p-3 text-(--foreground-100)',
          }"    
        />
      </UFormField>
      <UButton
        icon="i-lucide-send-horizontal"
        type="submit"
        label="Submit Request"
        variant="solid"
        loading-auto
        block
        size="md"
        class="font-bold button button-monochrome mt-3!"
      />
    </UForm>
  </UPageSection>

  <!-- final cta section -->
  <UPageCTA
    :title="cmsData?.ctaSection.title"
    :description="cmsData?.ctaSection.description"
    :ui="{
      root: 'rounded-none ring-0',
    }"
    :links="[
      {
        label: cmsData?.ctaSection.buttonText || 'Contact Us',
        color: 'neutral',
        icon: 'i-lucide-mail',
        to: cmsData?.ctaSection.buttonLink || '/',
        size: 'lg',
        variant: 'solid',
        class: 'font-bold button button-monochrome',
      },
    ]"
  />
  
</template>
<script lang="ts" setup>
import * as z from 'zod';
const { data: cmsDataRef } = await useSanityQuery<SupportPage>(supportPageQuery);
const cmsData = cmsDataRef.value!;

// Ensure we have CMS data - throw error if document doesn't exist
if (!cmsDataRef.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Support page content not found in CMS',
  });
}

const faqItems = computed(() => {
  return cmsData.faqSection.faqs.map((faq) => ({
    id: useId(),
    label: faq.question,
    content: faq.answer,
  }));
});

const dontSupportFaqItems = computed(() => {
  return cmsData.whatWeDontSupportSection.faqs.map((faq) => ({
    id: useId(),
    label: faq.question,
    content: faq.answer,
  }));
});

const typeOptions = [
  { label: "Bug Report", value: "bug" },
  { label: "General Issue", value: "issue" },
  { label: "Feature Request", value: "feature" },
  { label: "Other", value: "other" },
];

const supportSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  details: z.string().min(1, 'Details are required'),
});

const state = reactive<z.infer<typeof supportSchema>>({
  name: '',
  email: '',
  subject: '',
  details: '',
});

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
