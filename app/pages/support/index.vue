<template>
  <OrganismsBannerHero
    class="container"
    compact
    :description="cmsData?.hero.subtitle || 'Virify makes property search and marketing simple for everyone. With simple tools and smart, natural-language search with advanced filters to help you find exactly what you need.'"
  >
    <template #title>
      Virify Support
    </template>
  </OrganismsBannerHero>
  <!-- Faq section -->
  <UPageSection
    :title="cmsData.faqSection.title"
    :description="cmsData.faqSection.description"
    :ui="{
      description: 'max-w-180 mx-auto',
    }"
  >
    <UAccordion
      :items="faqItems"
      :ui="{
        label: 'font-bold title-xs',
        body: 'body-md'
      }"
      class="max-w-170 m-auto"
    />
  </UPageSection>
  <!-- our support section -->
  <UPageSection
    :title="cmsData?.ourSupportSection.title"
    :description="cmsData?.ourSupportSection.subtitle"
    headline="How we can help you"
    class="p-index__hero-dark"
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
  <!-- what we don't support section -->
  <UPageSection
    :title="cmsData.whatWeDontSupportSection.title"
    :description="cmsData.whatWeDontSupportSection.description"
    :ui="{
      description: 'max-w-180 mx-auto',
    }"
  >
    <UAccordion
      :items="dontSupportFaqItems"
      :ui="{
        label: 'font-bold title-xs',
        body: 'body-md'
      }"
      class="max-w-170 m-auto"

    />
  </UPageSection>
  <!-- support form section -->
  <UPageSection
    :title="cmsData?.SupportFormSection.title"
    :description="cmsData?.SupportFormSection.description"
    class="p-index__hero-dark"
    headline="Contact us"
    :ui="{
      root: 'section-gradient',
      container: 'max-w-180 mx-auto',
      headline: 'text-secondary',
    }"
  >
    <UForm 
      :schema="supportSchema" 
      :state="state" 
      class="flex flex-col gap-4"
      @submit="handleSubmit"
    >
      <!-- name -->
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
          base: 'p-3 text-(--foreground-100) focus:ring-secondary!'
          }"
        />
      </UFormField>
      <!-- email -->
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
            base: 'p-3 text-(--foreground-100) focus:ring-secondary!',
          }"
        />
      </UFormField>
      <!-- select -->
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
          variant="subtle"
          class="w-full" 
          :ui="{
            base: 'p-3 text-(--foreground-100) focus:ring-secondary!',
            trailingIcon: 'text-(--foreground-100)',
            value: 'text-(--foreground-100)',
          }"
        />
      </UFormField>
      <!-- details -->
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
            base: 'p-3 text-(--foreground-100) focus:ring-secondary!',
          }"    
        />
      </UFormField>

      <!-- Cloudflare Turnstile -->
      <div class="o-support-form__turnstile">
        <div ref="turnstileEl"></div>
      </div>

      <!-- submit -->
      <UButton
        icon="i-lucide-send-horizontal"
        type="submit"
        label="Submit Request"
        variant="solid"
        :loading="isPending"
        :disabled="disableButton || isPending"
        block
        size="md"
        class="font-bold button button-secondary mt-3! self-center"
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
        class: 'font-bold button button-secondary',
      },
    ]"
  />
  
</template>
<script lang="ts" setup>
const { turnstileToken, turnstileEl, initializeTurnstile, executeTurnstile, resetTurnstile, cleanupTurnstile } = useTurnstile();
const { data: cmsDataRef } = await useSanityQuery<SupportPage>(supportPageQuery);
const cmsData = cmsDataRef.value!;
const toast = useToast();
const { isPending, setPendingWhile } = usePending();

onMounted(() => {
  initializeTurnstile();
});

const typeOptions = [
  { label: "Bug Report", value: "bug" },
  { label: "General Issue", value: "issue" },
  { label: "Feature Request", value: "feature" },
  { label: "Other", value: "other" },
];

const state = reactive({
  name: '',
  email: '',
  subject: undefined as "bug" | "issue" | "feature" | "other" | undefined,
  details: '',
});

async function handleSubmit() {
  await setPendingWhile(async () => {
    try {
      await executeTurnstile();
      
      const response = await $fetch('/api/support', {
        method: 'POST',
        body: {
          ...state,
          turnstileToken: turnstileToken.value,
        },
      });

      if (response.success) {
        toast.add({ 
          title: 'Success', 
          description: 'Your support request has been submitted successfully!', 
          color: 'success', 
          icon: 'i-lucide-check-circle' 
        });
        resetForm();
      } else {
        toast.add({ 
          title: 'Error', 
          description: 'There was an issue submitting your request. Please try again later.', 
          color: 'error', 
          icon: 'i-lucide-alert-circle' 
        });
        resetTurnstile();
      }
    } catch (error) {
      console.error('Support form submission error:', error);
      toast.add({ 
        title: 'Error', 
        description: 'An unexpected error occurred. Please try again later.', 
        color: 'error', 
        icon: 'i-lucide-alert-circle' 
      });
      resetTurnstile();
    }
  });
}

function resetForm() {
  state.name = '';
  state.email = '';
  state.subject = undefined;
  state.details = '';
  resetTurnstile();
}

const disableButton = computed(() => {
  return (
    supportSchema.safeParse(state).success === false
  );
});

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
});

onUnmounted(() => {
  cleanupTurnstile();
});
</script>
