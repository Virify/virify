<template>
  <div class="o-faq">
    <p class="o-faq-subtitle | body-lg" v-if="description">{{ description }}</p>
    <MoleculesFaqItem class="o-faq-item" v-for="(item, index) in items" :key="index" :question="item.question" :answer="item.answer" :active="item.active" />
  </div>
</template>
<script lang="ts" setup>
interface Props {
  description?: string;
  items: FaqItem[];
}
const props = defineProps<Props>();

useSchemaOrg({
  "@type": "FAQPage",
  mainEntity: props.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});
</script>
<style lang="scss" scoped>
.o-faq {
  &-subtitle {
    text-align: center;
    margin: 0 auto;
    margin-bottom: var(--size-40);
    max-width: 700px;
  }

  &-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
