<template>
  <div class="legal-page | container">
    <section class="legal-page__content">
      <h1 class="legal-page__title | title-2xl">Terms & Conditions</h1>
      <p class="legal-page__intro | r-body-md-xs">These terms govern your use of Virify. Please read them carefully.</p>
      <p class="legal-page__updated | body-xs">Last updated: {{ lastUpdated }}</p>
      <h2 id="acceptance" class="title-sm">1. Acceptance of these terms</h2>
      <p>By creating an account or using Virify (the “Service”), you agree to these Terms & Conditions. If you do not agree, do not use the Service.</p>

      <h2 id="using-virify" class="title-sm">2. Using Virify</h2>
      <ul>
        <li>You must be at least 18 and have the legal capacity to enter a contract.</li>
        <li>You are responsible for the accuracy of information you provide and any activity under your account.</li>
        <li>We may update, suspend, or discontinue any part of the Service at any time.</li>
      </ul>

      <h2 id="accounts" class="title-sm">3. Accounts & Security</h2>
      <ul>
        <li>Keep your login credentials secure; do not share them.</li>
        <li>Tell us immediately if you believe your account has been compromised.</li>
      </ul>

      <h2 id="content" class="title-sm">4. Listings & User Content</h2>
      <ul>
        <li>You are responsible for content you submit (including listings, images, and messages) and must have the necessary rights to post it.</li>
        <li>You grant Virify a worldwide, non‑exclusive, royalty‑free licence to host, display and distribute your content to provide the Service.</li>
        <li>We may remove content that breaches these terms or applicable law.</li>
      </ul>

      <h2 id="payments" class="title-sm">5. Payments</h2>
      <p>Fees, if any, will be shown clearly before purchase. Payments are processed by trusted third‑party providers. Some features may be billed on a subscription basis. Unless otherwise stated, fees are non‑refundable to the fullest extent permitted by law.</p>

      <h2 id="prohibited" class="title-sm">6. Prohibited Conduct</h2>
      <ul>
        <li>No unlawful, misleading, or harmful activity.</li>
        <li>No scraping, reverse engineering, or circumvention of access controls.</li>
        <li>No posting of spam, malware, or infringing content.</li>
      </ul>

      <h2 id="ip" class="title-sm">7. Intellectual Property</h2>
      <p>Virify and associated marks, logos, software and content are the property of Virify or its licensors. Except for limited rights necessary to use the Service, no licence is granted.</p>

      <h2 id="third-parties" class="title-sm">8. Third‑Party Services</h2>
      <p>The Service may link to third‑party websites or services. We do not control or endorse them and are not responsible for their content or practices.</p>

      <h2 id="disclaimer" class="title-sm">9. Disclaimers</h2>
      <p>The Service is provided on an “as is” and “as available” basis. We do not guarantee uninterrupted or error‑free operation, or the accuracy of third‑party data. Nothing on Virify is legal, financial, or property advice.</p>

      <h2 id="liability" class="title-sm">10. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, Virify and its affiliates will not be responsible for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.</p>

      <h2 id="indemnity" class="title-sm">11. Indemnity</h2>
      <p>You agree to indemnify and hold Virify harmless from claims arising out of your use of the Service or breach of these terms.</p>

      <h2 id="termination" class="title-sm">12. Suspension & Termination</h2>
      <p>We may suspend or terminate access if you violate these terms or if we need to protect the Service or other users.</p>

      <h2 id="law" class="title-sm">13. Governing Law</h2>
      <p>These terms are governed by the laws of England and Wales, and the courts of England and Wales will have exclusive jurisdiction.</p>

      <h2 id="changes" class="title-sm">14. Changes to these Terms</h2>
      <p>We may update these terms from time to time. If the changes are material, we will provide reasonable notice. Continued use of the Service after changes take effect constitutes acceptance.</p>

      <h2 id="contact" class="title-sm">15. Contact</h2>
      <p>If you have questions about these terms, email <a href="mailto:support@virify.co.uk">support@virify.co.uk</a>.</p>
    </section>
  </div>
  
</template>

<script setup lang="ts">
definePageMeta({
  alias: ['/terms-and-conditions', '/legal/terms']
})

const lastUpdated = '14 Oct 2025'

useSeoMeta({
  title: 'Terms & Conditions — Virify',
  description: 'The terms that govern your use of Virify.',
})
</script>

<style scoped lang="scss">
@use '#styles/_utils/media' as mq;
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
    font-size: var(--font-lg)
  }

  &__content :deep(p),
  &__content :deep(ul) {
    margin-bottom: var(--size-16);
    font-size: var(--font-md)

  }

  &__content :deep(li) {
    margin-bottom: var(--size-8);
    font-size: var(--font-md)
  }
}
</style>
