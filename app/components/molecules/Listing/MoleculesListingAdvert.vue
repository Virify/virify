<template>
  <AtomsHeroCard class="o-listing-promo" variant="default">
    <AtomsIcon title="Virify Ltd" icon="logo/horizontal-colour" class="o-listing-promo__logo"/>
    <h2 class="title-md">{{ title }}</h2>
    <p class="r-body-md-sm">
      {{ description }}
    </p>
    <NuxtLink :to="link">
      <button class="button button-secondary">
        {{ linkText }}
      </button>
    </NuxtLink>
    <p v-if="showNote" class="| body-xs">
      <strong>Note:</strong> {{ note }}
    </p>
  </AtomsHeroCard>
</template>
<script setup lang="ts">

interface Props {
  title?: string;
  description?: string;
  link?: string;
  linkText?: string;
  note?: string;
  showNote?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: 'List your property with Virify!',
  description: 'Ready to sell or rent? Get your home in front of the right buyers and renters with Virify’s smart, modern platform.',
  link: '/account/create-listing',
  linkText: 'List Your Property',
  note: 'Virify is designed for transparency and ease. Listing is quick, and you’re always in control.',
  showNote: false
});
</script>
<style lang="scss">
.o-listing-promo {
  &__logo {
    height: 67px;
    width: 159px;
  }
}
</style>
