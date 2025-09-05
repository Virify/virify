<template>
  <footer class="o-footer">
    <div class="o-footer__container | container">
      <!-- Logo Section -->
      <div class="o-footer__brand">
        <nuxt-link to="/" class="o-footer__logo-link">
          <AtomsIcon title="Virify Ltd" icon="logo/horizontal-colour" width="180" height="54" class="o-footer__logo" />
        </nuxt-link>
      </div>

      <div class="o-footer__sections">
        <!-- Property Search Section -->
        <div class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Property Search</h3>
          <ul class="o-footer__links">
            <li><nuxt-link to="/ai-search" class="o-footer__link | body-sm">AI Search</nuxt-link></li>
            <li><nuxt-link to="/search/legacy" class="o-footer__link | body-sm">Legacy Search</nuxt-link></li>
          </ul>
        </div>

        <!-- List Property Section -->
        <div class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Sell Property</h3>
          <div class="o-footer__cta">
            <a href="#" class="o-footer__button | button button-secondary button-xs">List your property</a>
          </div>
        </div>

        <!-- Property Tools Section -->
        <div class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Property Tools</h3>
          <ul class="o-footer__links">
            <li><nuxt-link to="/price-paid" class="o-footer__link | body-sm">Price Paid Data</nuxt-link></li>
          </ul>
        </div>

        <!-- Guides Section -->
        <div class="o-footer__section">
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
        <div class="o-footer__section">
          <h3 class="o-footer__section-title | title-3xs">Company</h3>
          <ul class="o-footer__links">
            <li><a href="#" class="o-footer__link | body-sm">About Us</a></li>
            <li><a href="#" class="o-footer__link | body-sm">Contact Us</a></li>
            <li><a href="#" class="o-footer__link | body-sm">Privacy Policy</a></li>
            <li><a href="#" class="o-footer__link | body-sm">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="o-footer__bottom">
        <p class="o-footer__copyright | body-xs">Copyright &copy; Virify Ltd {{ currentYear }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();

// Get guide categories for footer navigation
const { useCategories } = useSanity();
const { data: categories } = await useCategories();
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-footer {
  background-color: var(--blue-400);
  color: var(--monochrome-900);
  width: 100%;
  padding: var(--size-48) 0 var(--size-32);

  &__container {
    display: flex;
    flex-direction: column;
    gap: var(--size-32);
  }

  &__sections {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    gap: var(--size-20);
    margin-top: var(--size-24);
    width: 100%;
    text-align: left;

    @include mq.mobile-only {
      flex-direction: column;
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
