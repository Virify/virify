<template>
<!-- Faq section -->
  <UPageSection
    :title="title"
    :description="description"
    :ui="{
      description: 'max-w-200 mx-auto',
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
</template>
<script setup lang="ts">
  interface Props {
    title?: string;
    description?: string;
    faqs?: SanityPageFaqSection["faqs"];
  }

  const props = defineProps<Props>();

  const faqItems = computed(() => {
    return props.faqs?.map(faq => ({
      id: useId(),
      label: faq.question,
      content: faq.answer,
    })) || [];
  });
</script>