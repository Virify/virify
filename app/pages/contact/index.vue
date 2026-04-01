<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <OrganismsBannerHero class="container" compact :description="cmsContent?.hero.subtitle || ''">
      <template #title>
        <span>Contact Us</span>
      </template>
    </OrganismsBannerHero>

    <!-- General Enquiry Section -->
    <UPageSection id="contact" :title="cmsContent?.formSection.title" :description="cmsContent?.formSection.description"
      headline="Get in touch" :ui="{
        container: 'max-w-180 mx-auto',
        headline: 'text-secondary',
      }">
      <UForm :schema="contactFormSchema" :state="enquiryState" class="flex flex-col gap-4"
        @submit="handleEnquirySubmit">
        <UFormField name="name" label="Name" required>
          <UInput v-model="enquiryState.name" placeholder="Your full name" class="w-full"
            :ui="{ base: 'p-3 text-(--foreground-100) focus:ring-secondary!' }" />
        </UFormField>
        <UFormField name="email" label="Email" required>
          <UInput v-model="enquiryState.email" placeholder="your.email@example.com" class="w-full"
            :ui="{ base: 'p-3 text-(--foreground-100) focus:ring-secondary!' }" />
        </UFormField>
        <UFormField name="telephone" label="Telephone">
          <UInput v-model="enquiryState.telephone" placeholder="Optional contact number" class="w-full"
            :ui="{ base: 'p-3 text-(--foreground-100) focus:ring-secondary!' }" />
        </UFormField>
        <UFormField name="enquiry" label="Enquiry" required>
          <UTextarea v-model="enquiryState.enquiry" placeholder="Tell us about your enquiry..." class="w-full"
            :ui="{ base: 'p-3 text-(--foreground-100) focus:ring-secondary!' }" />
        </UFormField>
        <div>
          <div ref="enquiryTurnstileEl"></div>
        </div>
        <UButton icon="i-lucide-send-horizontal" type="submit" label="Send Enquiry" variant="solid"
          :loading="isEnquiryPending" :disabled="disableEnquiryButton || isEnquiryPending" block size="md"
          class="font-bold button button-secondary mt-3! self-center" />
      </UForm>
    </UPageSection>

    <!-- Interested CTA -->
    <UPageCTA :title="cmsContent?.interestedSection.title" :description="cmsContent?.interestedSection.description"
      class="p-index__hero-dark" :ui="{ root: 'rounded-none ring-0' }" :links="[
        {
          label: cmsContent?.interestedSection.buttonText || 'Get Started',
          to: '/',
          color: 'neutral',
          icon: 'i-lucide-arrow-right',
          size: 'lg',
          variant: 'solid',
          class: 'font-bold button button-secondary',
        },
      ]" />

    <!-- Press Enquiry Section -->
    <UPageSection id="press" :title="cmsContent?.pressFormSection.title"
      :description="cmsContent?.pressFormSection.description" headline="Press Enquiries" :ui="{
        container: 'max-w-180 mx-auto',
        headline: 'text-secondary',
      }">
      <UForm :schema="contactFormSchema" :state="pressState" class="flex flex-col gap-4" @submit="handlePressSubmit">
        <UFormField name="name" label="Name" required>
          <UInput v-model="pressState.name" placeholder="Your full name" class="w-full"
            :ui="{ base: 'p-3 text-(--foreground-100) focus:ring-secondary!' }" />
        </UFormField>
        <UFormField name="email" label="Email" required>
          <UInput v-model="pressState.email" placeholder="your.email@example.com" class="w-full"
            :ui="{ base: 'p-3 text-(--foreground-100) focus:ring-secondary!' }" />
        </UFormField>
        <UFormField name="telephone" label="Telephone">
          <UInput v-model="pressState.telephone" placeholder="Optional contact number" class="w-full"
            :ui="{ base: 'p-3 text-(--foreground-100) focus:ring-secondary!' }" />
        </UFormField>
        <UFormField name="enquiry" label="Enquiry" required>
          <UTextarea v-model="pressState.enquiry" placeholder="Tell us about your enquiry..." class="w-full"
            :ui="{ base: 'p-3 text-(--foreground-100) focus:ring-secondary!' }" />
        </UFormField>
        <div>
          <div ref="pressTurnstileEl"></div>
        </div>
        <UButton icon="i-lucide-send-horizontal" type="submit" label="Send Enquiry" variant="solid"
          :loading="isPressPending" :disabled="disablePressButton || isPressPending" block size="md"
          class="font-bold button button-secondary mt-3! self-center" />
      </UForm>
    </UPageSection>

    <!-- Partner CTA -->
    <UPageCTA v-if="cmsContent?.partnerSection" :title="cmsContent.partnerSection.title"
      :description="cmsContent.partnerSection.description" :ui="{ root: 'rounded-none ring-0' }" :links="[
        {
          label: cmsContent.partnerSection.buttonText || 'Get in Touch',
          to: '#contact',
          color: 'neutral',
          icon: 'i-lucide-handshake',
          size: 'lg',
          variant: 'solid',
          class: 'font-bold button button-secondary',
        },
      ]" />

    <!-- FAQ Section -->
    <UPageSection :title="cmsContent?.faqSection.title" :description="cmsContent?.faqSection.description"
      class="p-index__hero-dark" :ui="{ description: 'max-w-180 mx-auto' }">
      <UAccordion :items="faqItems" :ui="{ label: 'font-bold title-xs', body: 'body-md' }" class="max-w-170 m-auto" />
    </UPageSection>

    <!-- Guides Section -->
    <UPageSection v-if="cmsContent?.guidesSection" :title="cmsContent.guidesSection.title"
      :description="cmsContent.guidesSection.description" headline="Helpful Guides" :ui="{
        headline: 'text-secondary',
      }">
      <UBlogPosts>
        <UBlogPost v-for="(guide, index) in cmsContent.guidesSection.guides" :key="index" variant="subtle"
          :title="guide.title" :description="guide.excerpt"
          :to="'guides/' + guide.category.slug.current + '/' + guide.slug.current"
          :badge="'Read Time: ' + guide.readTime + ' mins'" :date="guide.publishedAt"
          :authors="[{ name: 'Virify', avatar: { src: '/android-chrome-96x96.png', alt: 'Virify' } }]" :image="{
            provider: 'sanity',
            src: guide.heroImage?.asset._ref,
            alt: guide.heroImage?.alt || guide.title,
            width: 800,
            height: 600,
            loading: index < 3 ? 'eager' : 'lazy',
          }" :ui="{
            title: 'body-md font-bold',
            meta: 'justify-between',
            description: 'body-sm',
            body: 'justify-evenly',
          }" />
      </UBlogPosts>
    </UPageSection>
  </div>
</template>

<script setup lang="ts">
// Fetch CMS content
const { data: cmsContent } = await useSanityQuery<ContactPage>(contactPageQuery);

const toast = useToast();

// Enquiry form
const {
  turnstileToken: enquiryTurnstileToken,
  turnstileEl: enquiryTurnstileEl,
  initializeTurnstile: initEnquiryTurnstile,
  executeTurnstile: executeEnquiryTurnstile,
  resetTurnstile: resetEnquiryTurnstile,
  cleanupTurnstile: cleanupEnquiryTurnstile,
} = useTurnstile();

// Press form
const {
  turnstileToken: pressTurnstileToken,
  turnstileEl: pressTurnstileEl,
  initializeTurnstile: initPressTurnstile,
  executeTurnstile: executePressTurnstile,
  resetTurnstile: resetPressTurnstile,
  cleanupTurnstile: cleanupPressTurnstile,
} = useTurnstile();

const { isPending: isEnquiryPending, setPendingWhile: setEnquiryPendingWhile } = usePending();
const { isPending: isPressPending, setPendingWhile: setPressPendingWhile } = usePending();

const enquiryState = reactive({ name: "", email: "", telephone: "", enquiry: "" });
const pressState = reactive({ name: "", email: "", telephone: "", enquiry: "" });

const disableEnquiryButton = computed(() => contactFormSchema.safeParse(enquiryState).success === false);
const disablePressButton = computed(() => contactFormSchema.safeParse(pressState).success === false);

const faqItems = computed(() =>
  (cmsContent.value?.faqSection.faqs || []).map((faq) => ({
    label: faq.question,
    content: faq.answer,
  })),
);

onMounted(() => {
  initEnquiryTurnstile();
  initPressTurnstile();
});

onUnmounted(() => {
  cleanupEnquiryTurnstile();
  cleanupPressTurnstile();
});

async function handleEnquirySubmit() {
  await setEnquiryPendingWhile(async () => {
    try {
      await executeEnquiryTurnstile();
      const response = await $fetch<{ success: boolean; message: string }>("/api/contact", {
        method: "POST",
        body: { ...enquiryState, turnstileToken: enquiryTurnstileToken.value },
      });
      if (response.success) {
        toast.add({ title: "Enquiry sent!", description: response.message, color: "success", icon: "i-lucide-check-circle" });
        Object.assign(enquiryState, { name: "", email: "", telephone: "", enquiry: "" });
        resetEnquiryTurnstile();
      }
    } catch (error: any) {
      toast.add({ title: "Error", description: error.data?.statusMessage || "Failed to send enquiry. Please try again.", color: "error", icon: "i-lucide-alert-circle" });
      resetEnquiryTurnstile();
    }
  });
}

async function handlePressSubmit() {
  await setPressPendingWhile(async () => {
    try {
      await executePressTurnstile();
      const response = await $fetch<{ success: boolean; message: string }>("/api/contact", {
        method: "POST",
        body: { ...pressState, turnstileToken: pressTurnstileToken.value },
      });
      if (response.success) {
        toast.add({ title: "Enquiry sent!", description: response.message, color: "success", icon: "i-lucide-check-circle" });
        Object.assign(pressState, { name: "", email: "", telephone: "", enquiry: "" });
        resetPressTurnstile();
      }
    } catch (error: any) {
      toast.add({ title: "Error", description: error.data?.statusMessage || "Failed to send enquiry. Please try again.", color: "error", icon: "i-lucide-alert-circle" });
      resetPressTurnstile();
    }
  });
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
