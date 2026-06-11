<template>
  <footer class="o-footer">
    <div class="o-footer__container | container">
      <!-- Logo Section -->
      <div class="o-footer__brand">
        <nuxt-link
          to="/"
          class="o-footer__logo-link"
        >
          <svg
            width="113"
            height="32"
            class="o-footer__logo"
          >
            <title>Virify logo</title>
            <use href="/img/logo.svg#default"></use>
          </svg>
        </nuxt-link>
      </div>

      <div class="o-footer__sections">
        <!-- List Property Section -->
        <div
          v-if="createListing"
          class="o-footer__section"
        >
          <h3 class="o-footer__section-title | title-3xs">Sell Property</h3>
          <div class="o-footer__cta">
            <a
              href="#"
              class="o-footer__button | button button-secondary button-xs"
              >List your property</a
            >
          </div>
        </div>

        <!-- Property Tools Section -->
        <div class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Property Tools</h3>
          <ul class="o-footer__links">
            <li>
              <nuxt-link
                to="/price-paid"
                class="o-footer__link | body-sm"
                >Price Paid Data</nuxt-link
              >
            </li>
            <li>
              <nuxt-link
                to="/mortgage-calculator"
                class="o-footer__link | body-sm"
                >Mortgage Calculator</nuxt-link
              >
            </li>
            <!-- <li><nuxt-link to="/mortgage-calculator" class="o-footer__link | body-sm">Mortgage Calculator</nuxt-link></li> -->
          </ul>
        </div>

        <!-- Content Section -->
        <div class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Content</h3>
          <ul class="o-footer__links">
            <template
              v-for="category in contentCategories"
              :key="category._id"
            >
              <li>
                <nuxt-link
                  :to="`/content/${category.slug.current}`"
                  class="o-footer__link o-footer__link--category | body-sm"
                >
                  {{ category.title }}
                </nuxt-link>
              </li>
            </template>
          </ul>
        </div>

        <!-- Guides Section -->
        <div class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Guides</h3>
          <ul class="o-footer__links">
            <li>
              <nuxt-link
                to="/guides"
                class="o-footer__link | body-sm"
                >All Guides</nuxt-link
              >
            </li>
            <li
              v-for="category in categories"
              :key="category.slug.current"
            >
              <nuxt-link
                :to="`/guides/${category.slug.current}`"
                class="o-footer__link | body-sm"
              >
                {{ category.title }}
              </nuxt-link>
            </li>
          </ul>
        </div>

        <!-- Company Section -->
        <div class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Company</h3>
          <ul class="o-footer__links">
            <!-- <li><a href="#" class="o-footer__link | body-sm">About Us</a></li> -->
            <li>
              <nuxt-link
                to="/contact"
                class="o-footer__link | body-sm"
                >Contact Us</nuxt-link
              >
            </li>
            <li>
              <nuxt-link
                to="/support"
                class="o-footer__link | body-sm"
                >Support</nuxt-link
              >
            </li>
            <li>
              <nuxt-link
                to="/privacy"
                class="o-footer__link | body-sm"
                >Privacy Policy</nuxt-link
              >
            </li>
            <li>
              <nuxt-link
                to="/terms"
                class="o-footer__link | body-sm"
                >Terms & Conditions</nuxt-link
              >
            </li>
            <li>
              <nuxt-link
                to="/acceptable-use"
                class="o-footer__link | body-sm"
                >Acceptable Use Policy</nuxt-link
              >
            </li>
            <li>
              <nuxt-link
                to="/cookie"
                class="o-footer__link | body-sm"
                >Cookie Policy</nuxt-link
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="o-footer__bottom">
        <!-- Friendlier, Monzo-like disclaimer with protective legal backup on hover -->
        <p class="o-footer__copyright | body-xs">
          We like to help — our guides are friendly tips, not professional advice.
        </p>
        <p
          class="o-footer__copyright | body-xs"
          title="Our guides are for informational purposes only and do not constitute legal or professional advice."
        >
          © {{ currentYear }} Virify Ltd. All rights reserved. Company No. 16255324.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  const { createListing } = useFeatureFlag();

  const { data: navData } = await useSanityQuery<{
    guides: GuideCategory[];
    generalPages: SanityPageCategoryNavigationItem[];
  }>(navigationQuery);

  const categories = computed(() => navData.value?.guides ?? []);
  const contentCategories = computed(() => navData.value?.generalPages ?? []);

  const currentYear = new Date().getFullYear();
</script>

<style lang="scss">
  @use "#styles/_utils/media" as mq;

  .o-footer {
    background-color: light-dark(var(--blue-200), var(--blue-100));
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
      width: auto;
      height: var(--size-40);
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
