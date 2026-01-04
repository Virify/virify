<template>
  <section :class="['cta-section', { 'cta-section--gradient': gradient }]">
    <div class="container">
      <div class="cta-section__content">
        <h2 class="title-xl">
          <AtomsGradientTextRenderer 
            :text="title" 
            :variant="gradient ? 'dark' : 'light'"
          />
        </h2>
        <p class="body-lg max-width-prose">{{ description }}</p>
        <div class="cta-section__button-wrapper">
          <nuxt-link v-if="to" :to="to" class="button button-lg button-monochrome">
            {{ buttonText }}
          </nuxt-link>
          <AtomsButton v-else @click="$emit('click')" class="button-lg button-monochrome">
            {{ buttonText }}
          </AtomsButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

defineProps<{
  title: string;
  description: string;
  buttonText: string;
  to?: string; // If provided, renders nuxt-link. If not, renders button with click event
  gradient?: boolean; // Whether to apply gradient background
}>();

defineEmits<{
  click: [];
}>();
</script>

<style scoped lang="scss">
.cta-section {
  padding: var(--size-120) 0;

  &--gradient {
    background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
    color: var(--monochrome-900);
  }

  &__content {
    text-align: center;
    max-width: 700px;
    margin: 0 auto;

    h2 {
      margin-bottom: var(--size-16);
    }

    p {
      margin-bottom: var(--size-32);
    }
  }

  &__button-wrapper {
    display: flex;
    justify-content: center;

    .button {
      min-width: 280px;
    }
  }
}

.max-width-prose {
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
}
</style>
