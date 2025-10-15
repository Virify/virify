<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="container">
        <div class="contact-hero__content">
          <h1 class="contact-hero__title | title-2xl lineheight-xs">Contact <span class="gradient-text">Us</span></h1>
          <p class="contact-hero__subtitle | body-lg">Whether you're interested in partnering with us, have a question
            about our platform, or just want to get in touch—we'd love to hear from you.</p>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact-form-section" id="contact">
      <div class="container">
        <div class="contact-form-container">
          <h2 class="contact-form__title | title-md">Get in Touch</h2>
          <p class="contact-form__description | body-md">Fill in the form below and we'll get back to you as soon as
            possible. We typically respond within 24 hours.</p>

          <form @submit.prevent="handleSubmit" class="contact-form">
            <div v-if="formError" class="contact-form__error">
              {{ formError }}
            </div>

            <div class="contact-form__fields">
              <div class="contact-form__field">
                <label for="name" class="contact-form__label | body-sm">Name <span class="required">*</span></label>
                <AtomsInput id="name" v-model="formData.name" type="text" name="name" placeholder="Your full name"
                  minLength="4" maxLength="40" required :disabled="isSubmitting || isSuccess" />
              </div>

              <div class="contact-form__field">
                <label for="email" class="contact-form__label | body-sm">Email <span class="required">*</span></label>
                <AtomsInput id="email" v-model="formData.email" type="email" name="email"
                  placeholder="your.email@example.com" required :disabled="isSubmitting || isSuccess" />
              </div>

              <div class="contact-form__field">
                <label for="telephone" class="contact-form__label | body-sm">Telephone</label>
                <AtomsInput id="telephone" v-model="formData.telephone" type="tel" name="telephone"
                  placeholder="Optional contact number" pattern="[0-9+\s\-\(\)]*"
                  title="Please enter a valid phone number" :disabled="isSubmitting || isSuccess" />
              </div>

              <div class="contact-form__field contact-form__field--full">
                <label for="enquiry" class="contact-form__label | body-sm">Enquiry <span
                    class="required">*</span></label>
                <textarea 
                  id="enquiry" 
                  ref="enquiryInput"
                  v-model="formData.enquiry" 
                  name="enquiry"
                  class="contact-form__textarea | text-input body-sm" 
                  placeholder="Tell us about your enquiry..."
                  rows="6" 
                  minlength="10" 
                  maxlength="1000" 
                  required 
                  :disabled="isSubmitting || isSuccess"
                  @input="checkEnquiryValidity"
                ></textarea>
                <AtomsInlineError v-if="enquiryError" id="enquiry-error">
                  {{ enquiryError }}
                </AtomsInlineError>
              </div>
            </div>

            <!-- Cloudflare Turnstile -->
            <div class="contact-form__turnstile">
              <div ref="turnstileEl"></div>
            </div>

            <div class="contact-form__submit-wrapper">
              <AtomsButton v-if="!isSuccess" class="contact-form__submit-button | button-monochrome" type="submit"
                :pending="isSubmitting" :disabled="!isFormValid || isSubmitting">
                Send Enquiry
              </AtomsButton>
            </div>

            <div class="contact-form__success" v-if="isSuccess">
              <AtomsIcon icon="tick" :size="48" class="contact-form__success-icon" />
              <h3 class="title-sm">Message sent!</h3>
              <p class="body-sm">{{ message }}</p>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="contact-info">
      <div class="container">
        <div class="contact-info__content">
          <h2 class="title-xl">Looking to <span class="gradient-text">Partner?</span></h2>
          <p class="body-lg max-width-prose">We're always open to working with like-minded businesses, property
            professionals, and technology partners who share our vision of making property buying and selling more
            transparent and accessible.</p>
            <AtomsButton @click="scrollToForm" class="waiting-list__button | button-lg button-monochrome"> Get in Touch </AtomsButton>
        </div>
      </div>
    </section>
    <section class="contact-form-section">
      <div class="container">
        <div class="contact-form-container">
          <h2 class="title-xl">Interested in what we are doing?</h2>
          <p class="body-lg max-width-prose">We're always looking to connect with individuals and organizations who share our passion for innovation in the property sector. If you're interested in collaborating or learning more about our initiatives, please don't hesitate to reach out.</p>
          <nuxt-link to="/waiting-list" class="waiting-list__button | button button-lg button-monochrome"> 
            Join the Waiting List
          </nuxt-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { showToast } = useToast();
const config = useRuntimeConfig();

const formData = ref({
  name: "",
  email: "",
  telephone: "",
  enquiry: "",
});

const isSubmitting = ref(false);
const isSuccess = ref(false);
const formError = ref<string | null>(null);
const enquiryError = ref<string | null>(null);
const message = ref("Thank you for your enquiry. We'll get back to you as soon as possible.");
const turnstileToken = ref<string | null>(null);
const turnstileEl = ref<HTMLElement | null>(null);
const widgetId = ref<string | null>(null);

const isFormValid = computed(() => {
  return formData.value.name.trim() !== "" &&
    formData.value.email.trim() !== "" &&
    formData.value.enquiry.trim() !== "";
});

function checkEnquiryValidity(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  if (target.validity.valid) {
    enquiryError.value = null;
  } else if (target.validity.tooShort) {
    enquiryError.value = "Enquiry must be at least 10 characters";
  } else if (target.validity.valueMissing) {
    enquiryError.value = "Enquiry is required";
  }
}

function scrollToForm() {
  const formSection = document.getElementById('contact');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
}

onMounted(() => {
  widgetId.value = (window as any).turnstile.render(turnstileEl.value, {
    sitekey: config.public.CF_SITE_KEY,
    size: 'invisible',
    execution: 'execute',
    callback: (token: string) => {
      turnstileToken.value = token;
      submitForm();
    },
  });
});

onUnmounted(() => {
  if ((window as any).turnstile && widgetId.value) {
    try {
      (window as any).turnstile.remove(widgetId.value);
    } catch (_) {}
  }
});

async function handleSubmit() {
  formError.value = null;
  
  if (!isFormValid.value) {
    formError.value = "Please complete all required fields";
    return;
  }
  
  isSubmitting.value = true;
  
  if ((window as any).turnstile && widgetId.value) {
    (window as any).turnstile.execute(widgetId.value);
  }
}

async function submitForm() {
  try {
    const response = await $fetch<{ success: boolean; message: string }>("/api/contact", {
      method: "POST",
      body: {
        name: formData.value.name,
        email: formData.value.email,
        telephone: formData.value.telephone,
        enquiry: formData.value.enquiry,
        turnstileToken: turnstileToken.value,
      },
    });

    if (response.success) {
      isSuccess.value = true;
      message.value = response.message;
      showToast(message.value, { type: "success" });
    }
  } catch (error: any) {
    console.error("Contact form error:", error);
    formError.value = error.data?.statusMessage || error.statusMessage || "Failed to send enquiry. Please try again.";
    
    if ((window as any).turnstile && widgetId.value) {
      try { 
        (window as any).turnstile.reset(widgetId.value);
      } catch (_) {}
      turnstileToken.value = null;
    }
  } finally {
    isSubmitting.value = false;
  }
}

// SEO Meta
useHead({
  title: 'Contact Virify - Get in Touch | Private Property Marketplace UK',
  meta: [
    { name: 'description', content: 'Contact Virify for partnership opportunities, platform questions, or general enquiries about the UK\'s first private property marketplace. We respond within 24 hours.' },
    { name: 'keywords', content: 'contact Virify, property marketplace contact, partnership opportunities, estate agent alternative contact, private property listings UK' },
    { name: 'robots', content: 'index, follow' },
    
    // Open Graph
    { property: 'og:title', content: 'Contact Virify - Get in Touch' },
    { property: 'og:description', content: 'Get in touch with Virify about partnerships, questions, or general enquiries.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://virify.co.uk/contact' },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Contact Virify' },
    { name: 'twitter:description', content: 'Get in touch with Virify about partnerships, questions, or general enquiries.' },
  ],
  link: [
    { rel: 'canonical', href: 'https://virify.co.uk/contact' },
  ],
  script: [
    {
      src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
      async: true,
      defer: true,
    }
  ]
});
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;

// Shared gradient background
.section-gradient-bg {
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  color: var(--monochrome-900);
}

// Hero Section
.contact-hero {
  @extend .section-gradient-bg;
  padding: var(--size-80) var(--size-32) var(--size-64);
  min-height: 45vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @include mq.tablet {
    padding: var(--size-32);
    background:
      url("/img/logo-background.svg") no-repeat top right,
      linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
    background-size:
      auto 120%,
      cover;
  }

  &__content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  &__title {
    margin-bottom: var(--size-24);
  }

  &__subtitle {
    margin: 0 auto;
  }
}

// Form Section
.contact-form-section {
  padding: var(--size-64) 0;
}

.contact-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--size-48);

  @include mq.mobile-only {
    padding: 0;
  }
}

.contact-form {
  &__title {
    margin: 0 0 var(--size-12) 0;
    text-align: center;
  }

  &__description {
    text-align: center;
    color: var(--text-muted);
    max-width: 600px;
    margin: 0 auto var(--size-40);
  }

  &__error {
    padding: var(--size-16);
    background: fn.faded-color(10%, var(--error));
    border: 1px solid var(--error);
    border-radius: var(--border-radius-md);
    color: var(--error);
    margin-bottom: var(--size-24);
    text-align: center;
  }

  &__fields {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-24);
    margin-bottom: var(--size-32);

    @include mq.tablet {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__field {
    &--full {
      grid-column: 1 / -1;
    }
  }

  &__label {
    display: block;
    margin-bottom: var(--size-8);
    font-weight: 500;

    .required {
      color: var(--error);
    }
  }

  &__textarea {
    width: 100%;
    height: auto;
    padding: var(--size-12) var(--size-16);
    resize: vertical;
    min-height: 120px;
    line-height: 1.5;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__turnstile {
    display: flex;
    justify-content: center;
    margin: var(--size-24) 0;
  }

  &__submit-wrapper {
    display: flex;
    justify-content: center;
  }

  &__submit-button {
    min-width: 200px;
    padding: var(--size-12) var(--size-32);
  }

  &__success {
    text-align: center;
    padding: var(--size-32) var(--size-16);
    border-radius: var(--border-radius-lg);
    margin-top: var(--size-24);

    h3 {
      margin: var(--size-16) 0 var(--size-8);
    }

    p {
      margin: 0;
    }
  }
}

// Info Section
.contact-info {
  @extend .section-gradient-bg;
  padding: var(--size-120) 0;

  &__content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;

    h2 {
      margin-bottom: var(--size-16);
    }

    p {
      margin: 0;
    }
  }
}

// Utility classes
.max-width-prose {
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.waiting-list__button {
  display: flex;
  align-self: center;
  justify-self: center;
  margin-top: var(--size-24);
}
</style>
