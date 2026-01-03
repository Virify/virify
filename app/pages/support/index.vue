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
    <!-- Things we cant help with -->
    <section class="p-support__faq section-gradient-bg | flow flow-lg">
      <h2 class="p-support__faq--title | title-xl">
        <AtomsGradientTextRenderer text="Things We {gradient}Can't Help With{/gradient}" variant="dark" />
      </h2>
      <OrganismsFaq
        description="Here are some of our most frequently asked questions. If you need further assistance, feel free to reach out to our support team."
        :items="nonSupportFaqItems" />
    </section>
    <section class="p-support__form section">
      <h2 class="p-support__form--title | title-xl">
        <AtomsGradientTextRenderer text="Get {gradient}Help{/gradient} and {gradient}Support{/gradient}" variant="light" />
      </h2>
      <p class="p-support__form--description | body-lg center-text">Having an issue or need help? Let us know and we'll get back to you as soon as possible.</p>

      <OrganismsSupportForm />
    </section>
  </div>
</template>
<script lang="ts" setup>
import OrganismsSupportForm from "~/components/organisms/Forms/OrganismsSupportForm.vue";
import { supportFaqItems, nonSupportFaqItems } from "~/utils/faq";

const heroTitle = "{gradient}" + "Help" + "{/gradient}" + " and " + "{gradient}" + " Support" + "{/gradient}";

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
