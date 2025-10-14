<template>
  <div class="legal-page | container">
    <section class="legal-page__content">
      <h1 class="legal-page__title | title-2xl">Privacy Policy</h1>
      <p class="legal-page__intro | r-body-md-xs">How Virify collects, uses, and protects your personal information.</p>
      <p class="legal-page__updated | body-xs">Last updated: {{ lastUpdated }}</p>
      <h2 id="overview" class="title-lg">1. Overview</h2>
      <p>This Privacy Policy explains what data we collect when you use Virify (the “Service”), why we collect it, and how it is used. We act as a data controller when we determine the purposes and means of processing your personal data.</p>

      <h2 id="data-we-collect" class="title-lg">2. Data we collect</h2>
      <ul>
        <li>Account data: name, email address, authentication identifiers.</li>
        <li>Profile and listing data you choose to provide (e.g., property details, images, location).</li>
        <li>Usage data: device information, log data, and analytics such as page views and events.</li>
        <li>Communications: messages you send through the Service, support requests, and feedback.</li>
        <li>Cookies and similar technologies for authentication, preferences, and analytics.</li>
      </ul>

      <h2 id="how-we-use-data" class="title-lg">3. How we use data</h2>
      <ul>
        <li>To provide and improve the Service and its features.</li>
        <li>To personalise content and recommendations.</li>
        <li>To communicate with you about updates, security notices, and support.</li>
        <li>To prevent fraud, abuse, and to enforce our terms.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2 id="legal-bases" class="title-lg">5. Legal bases</h2>
      <p>We process personal data on the basis of your consent, our legitimate interests in operating and improving the Service, performance of a contract with you, and compliance with legal obligations.</p>

      <h2 id="retention" class="title-lg">6. Data retention</h2>
      <p>We retain data for as long as necessary to provide the Service, comply with our legal obligations, resolve disputes, and enforce our agreements.</p>

      <h2 id="security" class="title-lg">7. Security</h2>
      <p>We use administrative, technical, and physical safeguards designed to protect personal data. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.</p>

      <h2 id="your-rights" class="title-lg">8. Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal data, and to data portability. You can also object to processing based on legitimate interests and withdraw consent where
        applicable.
      </p>

      <h2 id="cookies" class="title-lg">9. Cookies</h2>
      <p>We use cookies and similar technologies for essential functionality, preferences, analytics, and security. You can control cookies through your browser settings.</p>

      <h2 id="international" class="title-lg">10. International transfers</h2>
      <p>Your data may be processed outside your country. When we transfer data internationally, we use appropriate safeguards such as standard contractual clauses.</p>

      <h2 id="children" class="title-lg">11. Children</h2>
      <p>The Service is not directed to children under 18. If you believe we have collected personal data from a child, contact us and we will take appropriate steps.</p>

      <h2 id="changes" class="title-lg">12. Changes to this policy</h2>
      <p>We may update this Privacy Policy from time to time. If changes are material, we will provide reasonable notice. Your continued use of the Service means you accept the updated policy.</p>

      <h2 id="contact" class="title-lg">13. Contact</h2>
      <p>For privacy questions or requests, email <a href="mailto:support@virify.co.uk">support@virify.co.uk</a>.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  alias: ["/privacy-policy", "/legal/privacy"],
});

const lastUpdated = "14 Oct 2025";

useSeoMeta({
  title: "Privacy Policy — Virify",
  description: "How Virify collects, uses and protects your information.",
});
</script>

<style scoped lang="scss">
@use "#styles/_utils/media" as mq;
.legal-page {
  margin: 0 auto;
  padding-block: var(--size-24);

  /* Ensure clear spacing between page sections */
  > section + section {
    margin-top: var(--size-32);

    @include mq.desktop {
      margin-top: var(--size-48);
    }
  }

  &__hero {
    padding: 0 var(--size-8);
  }

  &__title {
    margin-bottom: var(--size-8);
    color: var(--foreground-100);
  }

  &__intro {
    margin-bottom: var(--size-8);
    color: var(--foreground-100);
    opacity: 0.95;
  }

  &__updated {
    opacity: 0.9;
  }

  &__content {
    display: block;
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    padding: var(--size-24);
    color: var(--foreground-100);
  }

  &__content :deep(h2) {
    margin-top: var(--size-24);
    font-size: var(--font-lg);
  }

  &__content :deep(p),
  &__content :deep(ul) {
    margin-bottom: var(--size-16);
    font-size: var(--font-md);
  }

  &__content :deep(li) {
    margin-bottom: var(--size-8);
    font-size: var(--font-md);
  }
}
</style>
