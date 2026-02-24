<template>
  <footer class="o-footer">
    <div class="o-footer__container | container">
      <!-- Logo Section -->
      <div class="o-footer__brand" v-if="!isWaitingListMode">
        <nuxt-link to="/" class="o-footer__logo-link">
          <AtomsIcon title="Virify Ltd" icon="logo/horizontal-colour" width="180" height="54" class="o-footer__logo" />
        </nuxt-link>
      </div>

      <div class="o-footer__sections">
        <div class="o-footer__brand" v-if="isWaitingListMode">
          <nuxt-link to="/" class="o-footer__logo-link">
            <AtomsIcon title="Virify Ltd" icon="logo/horizontal-colour" width="120" height="54" class="o-footer__logo" />
          </nuxt-link>
        </div>
        <!-- List Property Section -->
        <div v-if="footerConfig.showSellProperty" class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Sell Property</h3>
          <div class="o-footer__cta">
            <a href="#" class="o-footer__button | button button-secondary button-xs">List your property</a>
          </div>
        </div>

        <!-- Property Tools Section -->
        <div v-if="footerConfig.showPropertyTools" class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Property Tools</h3>
          <ul class="o-footer__links">
            <li><nuxt-link to="/price-paid" class="o-footer__link | body-sm">Price Paid Data</nuxt-link></li>
            <!-- <li><nuxt-link to="/mortgage-calculator" class="o-footer__link | body-sm">Mortgage Calculator</nuxt-link></li> -->
          </ul>
        </div>

        <!-- Guides Section -->
        <div v-if="footerConfig.showGuides" class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Guides</h3>
          <ul class="o-footer__links">
            <li><nuxt-link to="/guides" class="o-footer__link | body-sm">All Guides</nuxt-link></li>
            <li v-for="category in categories" :key="category.slug.current">
              <nuxt-link :to="`/guides/${category.slug.current}`" class="o-footer__link | body-sm">
                {{ category.title }}
              </nuxt-link>
            </li>
          </ul>
        </div>

        <!-- Company Section -->
        <div v-if="footerConfig.showCompany" class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Company</h3>
          <ul class="o-footer__links">
            <!-- <li><a href="#" class="o-footer__link | body-sm">About Us</a></li> -->
            <li><nuxt-link to="/contact" class="o-footer__link | body-sm">Contact Us</nuxt-link></li>
            <li><nuxt-link to="/support" class="o-footer__link | body-sm">Support</nuxt-link></li>
            <li><nuxt-link to="/privacy" class="o-footer__link | body-sm">Privacy Policy</nuxt-link></li>
            <li><nuxt-link to="/terms" class="o-footer__link | body-sm">Terms & Conditions</nuxt-link></li>
            <li><nuxt-link to="/cookie" class="o-footer__link | body-sm">Cookie Policy</nuxt-link></li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="o-footer__bottom">
        <!-- Friendlier, Monzo-like disclaimer with protective legal backup on hover -->
        <p class="o-footer__copyright | body-xs">
          We like to help — our guides are friendly tips, not legal advice.
        </p>
        <p class="o-footer__copyright | body-xs" title="Our guides are for informational purposes only and do not constitute legal or professional advice.">
          © {{ currentYear }} Virify Ltd. All rights reserved. Company No. 16255324.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">

const { isWaitingListMode, config } = useWaitingListMode()

// Get guide categories for footer navigation
const { data: categories } = await useSanityQuery<GuideCategory[]>(categoriesQuery)

// Determine which sections to show
const footerConfig = computed(() => {
  if (!isWaitingListMode.value) {
    // Show everything when not in waiting-list mode
    return {
      showSellProperty: true,
      showPropertyTools: true,
      showGuides: true,
      showCompany: true,
    }
  }
  // Use waiting-list config when in waiting-list mode
  return {
    showSellProperty: config.footer.showSellProperty,
    showPropertyTools: config.footer.showPropertyTools,
    showGuides: config.footer.showGuides,
    showCompany: config.footer.showCompany,
  }
})

const currentYear = new Date().getFullYear();
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-footer {
  background-color: #26333C;
  color: var(--monochrome-900);
  width: 100%;
  padding: var(--size-48) 0 var(--size-32);

  &__container {
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
  }

  &__sections {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: row;
    gap: var(--size-48);
    margin-top: var(--size-12);
    width: 100%;
    text-align: left;

    @include mq.mobile-only {
      flex-direction: column;
      gap: var(--size-12);
    }
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    padding: var(--size-16);
  }

  &__brand {
    display: flex;
    align-items: center;
  }

  &__logo-link {
    display: block;
  }

  &__logo {
    display: block;
    width: 100%;
    height: auto;
  }

  &__section-title {
    color: var(--monochrome-900);
    margin-bottom: 0;
  }

  &__links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
  }

  &__link {
    color: var(--monochrome-700);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--monochrome-900);
      text-decoration: underline;
    }
  }

  &__bottom {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
    border-top: 1px solid var(--monochrome-700);
    padding-top: var(--size-24);
  }

  &__copyright {
    color: var(--monochrome-600);
    margin: 0;
  }

  &__cta {
    display: flex;
    flex-direction: column;
  }

  &__button {
    display: inline-block;
    text-decoration: none;
    width: fit-content;
  }
}
</style>
