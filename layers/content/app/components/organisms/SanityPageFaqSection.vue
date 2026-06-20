<template>
  <!-- Faq section -->
  <UPageSection
    :title="title"
    :description="description"
    :headline="highlight"
    :ui="{
      container: 'max-w-none p-0! py-16!',
      description: 'max-w-200 mx-auto',
      headline: 'text-secondary/90 font-bold',
    }"
  >
    <UAccordion
      :items="faqItems"
      :ui="{
        label: 'font-bold title-xs',
        body: 'body-md',
      }"
      default-value="0"
      class="max-w-170 m-auto"
    />
  </UPageSection>
</template>
<script setup lang="ts">
  import type { AccordionItem } from "@nuxt/ui";

  interface Props {
    title?: string;
    description?: string;
    faqs?: SanityPageFaqSection["faqs"];
    highlight?: string;
  }

  const props = defineProps<Props>();

  const faqItems = computed<AccordionItem[]>(() => {
    return (
      props.faqs?.map((faq) => ({
        id: useId(),
        label: faq.question,
        content: faq.answer,
      })) || []
    );
  });

  useSchemaOrg(
    props.faqs?.map((faq) =>
      defineQuestion({
        name: faq.question,
        acceptedAnswer: faq.answer,
      }),
    ) || [],
  );
</script>
