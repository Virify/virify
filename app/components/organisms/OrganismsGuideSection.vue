<template>
  <section :class="['contact-guides', padding]">
    <div class="container">
      <h2 class="contact-guides__title | title-xl">
        <template v-for="(part, index) in parseGradientTextParts(title || '')" :key="index">
          <span v-if="part.isGradient" :class="gradientClass">{{ part.text }}</span>
          <template v-else>{{ part.text }}</template>
        </template>
      </h2>
      <p class="contact-guides__description | body-lg">{{ description || '' }}</p>
      <OrganismsGuidesCarousel v-if="guides && guides.length" :guides="guides" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { parseGradientTextParts as parseParts } from "../../utils/gradient-text";

const props = defineProps({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  guides: { type: Array as () => any[], default: () => [] },
  gradientClass: { type: String, default: "gradient-text" },
  section: { type: Boolean, default: true },
});

const parseGradientTextParts = (text: string) => parseParts(text);

const title = props.title;
const description = props.description;
const guides = props.guides;
const gradientClass = props.gradientClass;

const padding = computed(() => (props.section ? "section-padding" : "non-section-padding"));
</script>

<style scoped lang="scss">
.contact-guides {
  &.section-padding {
    padding-top: var(--size-120);
    padding-bottom: var(--size-120);
  }
  &.non-section-padding {
    padding-bottom: var(--size-120);
  }

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
