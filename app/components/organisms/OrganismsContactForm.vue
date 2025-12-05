<template>
  <div class="contact-form-container">
    <h2 class="contact-form__title | title-md">{{ title }}</h2>
    <p class="contact-form__description | body-md">{{ description }}</p>

    <form @submit.prevent="handleSubmit" class="contact-form">
      <div v-if="formError" class="contact-form__error">
        {{ formError }}
      </div>

      <div class="contact-form__fields">
        <div class="contact-form__field">
          <label :for="`${formId}-name`" class="contact-form__label | body-sm">
            Name <span class="required">*</span>
          </label>
          <AtomsInput 
            :id="`${formId}-name`" 
            v-model="formData.name" 
            type="text" 
            name="name" 
            placeholder="Your full name"
            minLength="4" 
            maxLength="40" 
            required 
            :disabled="isSubmitting || isSuccess" 
          />
        </div>

        <div class="contact-form__field">
          <label :for="`${formId}-email`" class="contact-form__label | body-sm">
            Email <span class="required">*</span>
          </label>
          <AtomsInput 
            :id="`${formId}-email`" 
            v-model="formData.email" 
            type="email" 
            name="email"
            placeholder="your.email@example.com" 
            required 
            :disabled="isSubmitting || isSuccess" 
          />
        </div>

        <div class="contact-form__field">
          <label :for="`${formId}-telephone`" class="contact-form__label | body-sm">Telephone</label>
          <AtomsInput 
            :id="`${formId}-telephone`" 
            v-model="formData.telephone" 
            type="tel" 
            name="telephone"
            placeholder="Optional contact number" 
            pattern="[0-9+\s\-\(\)]*"
            title="Please enter a valid phone number" 
            :disabled="isSubmitting || isSuccess" 
          />
        </div>

        <div class="contact-form__field contact-form__field--full">
          <label :for="`${formId}-enquiry`" class="contact-form__label | body-sm">
            Enquiry <span class="required">*</span>
          </label>
          <textarea 
            :id="`${formId}-enquiry`" 
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
          <AtomsInlineError v-if="enquiryError" :id="`${formId}-enquiry-error`">
            {{ enquiryError }}
          </AtomsInlineError>
        </div>
      </div>

      <!-- Cloudflare Turnstile -->
      <div class="contact-form__turnstile">
        <div ref="turnstileEl"></div>
      </div>

      <div class="contact-form__submit-wrapper">
        <AtomsButton 
          v-if="!isSuccess" 
          class="contact-form__submit-button | button-monochrome" 
          type="submit"
          :pending="isSubmitting" 
          :disabled="!isFormValid || isSubmitting"
        >
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
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
  formType: 'enquiry' | 'press';
  formId: string;
}>();

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

onMounted(() => {
  let retryCount = 0;
  const maxRetries = 50;

  const initTurnstile = () => {
    if ((window as any).turnstile && turnstileEl.value) {
      try {
        widgetId.value = (window as any).turnstile.render(turnstileEl.value, {
          sitekey: config.public.CF_SITE_KEY,
          size: 'invisible',
          execution: 'execute',
          callback: (token: string) => {
            turnstileToken.value = token;
            submitForm();
          },
        });
      } catch (error) {
        console.error('Failed to initialize Turnstile:', error);
      }
    } else if (retryCount < maxRetries) {
      retryCount++;
      setTimeout(initTurnstile, 100);
    } else {
      console.error('Turnstile script failed to load after maximum retries');
    }
  };

  initTurnstile();
});

onUnmounted(() => {
  if ((window as any).turnstile && widgetId.value) {
    try {
      (window as any).turnstile.remove(widgetId.value);
    } catch (_) { }
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
        formType: props.formType,
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
      } catch (_) { }
      turnstileToken.value = null;
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;

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
    padding-top: var(--size-16);

    h3 {
      margin: var(--size-16) 0 var(--size-8);
    }

    p {
      margin: 0;
    }
  }
}
</style>
