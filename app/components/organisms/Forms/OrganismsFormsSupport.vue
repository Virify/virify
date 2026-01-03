<template>
  <MoleculesForm @submit.prevent="submitForm" class="o-support-form | stacked" :error="formErrors">
    <MoleculesFormField label="Your Name" v-slot="{ id }">
      <AtomsInput ref="nameInput" :id type="text" name="name" v-model="formName" required />
    </MoleculesFormField>

    <MoleculesFormField label="Email Address" v-slot="{ id }">
      <AtomsInput ref="emailInput" :id type="email" name="email" v-model="formEmail" required />
    </MoleculesFormField>

    <MoleculesFormField label="Type" v-slot="{ id }">
      <AtomsSelect :id name="type" v-model="formType" :options="typeOptions" required
        class="o-support-form__select | body-sm select-input">
        <template #default="{ options }">
          <option value="" disabled>Select type...</option>
          <option v-for="({ key, value }) in options" :key="value" :value="value">
            {{ key }}
          </option>
        </template>
      </AtomsSelect>
    </MoleculesFormField>

    <MoleculesFormField label="Details" v-slot="{ id }">
      <AtomsTextarea :id name="details" v-model="formDetails" rows="5" required
        placeholder="Please describe your issue or question in detail." class="o-support-form__textarea" />
    </MoleculesFormField>

    <!-- Cloudflare Turnstile -->
    <div class="o-support-form__turnstile">
      <div ref="turnstileEl"></div>
    </div>

    <AtomsButton type="submit" class="button button-secondary" :pending="isPending"
      :disabled="disableSubmit || isPending">
      Submit Request
    </AtomsButton>
  </MoleculesForm>
</template>
<script lang="ts" setup>
import type { AtomsInput } from '#components';
import type { ErrorBoxProp } from '~/types';

const { showToast } = useToast();
const { isPending, setPendingWhile } = usePending();
const { turnstileToken, turnstileEl, initializeTurnstile, executeTurnstile, resetTurnstile, cleanupTurnstile } = useTurnstile();

const nameInput = ref<InstanceType<typeof AtomsInput> | null>(null);
const emailInput = ref<InstanceType<typeof AtomsInput> | null>(null);
const formName = ref("");
const formEmail = ref("");
const formType = ref("");
const formDetails = ref("");
const formErrors = ref<ErrorBoxProp | null>(null);
const pendingResolve = ref<(() => void) | null>(null);

const typeOptions = [
  { key: "Bug Report", value: "bug" },
  { key: "General Issue", value: "issue" },
  { key: "Feature Request", value: "feature" },
  { key: "Other", value: "other" },
];

const disableSubmit = computed(() => {
  const hasNameError = nameInput.value?.validityText;
  const hasEmailError = emailInput.value?.validityText;

  return !formName.value ||
    !formEmail.value ||
    !!hasNameError ||
    !!hasEmailError ||
    !formType.value ||
    !formDetails.value ||
    !!formErrors.value;
});

async function submitForm(event: Event) {
  const form = event.target as HTMLFormElement;
  const { errors, formData } = useFormData(form);

  if (errors) {
    formErrors.value = errors;
    return;
  }

  // Clear any previous errors
  formErrors.value = null;

  // Wrap entire submission flow in pending state
  await setPendingWhile(async () => {
    return new Promise<void>((resolve) => {
      pendingResolve.value = resolve;
      executeTurnstile();
    });
  });
}

async function performSubmit(form: HTMLFormElement) {
  try {
    // Convert FormData to JSON object
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const result = await $fetch('/api/support', {
      method: 'POST',
      body: {
        ...data,
        turnstileToken: turnstileToken.value,
      },
    });

    if (result?.success) {
      showToast("Support request submitted successfully!", { type: "success" });
      form.reset();
      formErrors.value = null;
    } else {
      showToast("There was an error submitting your request. Please try again later.", { type: "error" });
      resetTurnstile();
    }
  } catch (error) {
    showToast("There was an error submitting your request. Please try again later.", { type: "error" });
    resetTurnstile();
  } finally {
    // Resolve the promise to end pending state
    if (pendingResolve.value) {
      pendingResolve.value();
      pendingResolve.value = null;
    }
  }
}

onMounted(() => {
  initializeTurnstile(() => {
    const form = document.querySelector('.o-support-form') as HTMLFormElement;
    if (form) {
      performSubmit(form);
    }
  });
});

onUnmounted(() => {
  cleanupTurnstile();
});
</script>
<style lang="scss" scoped>
.o-support-form {
  max-width: 700px;
  margin: 0 auto;

  &__select {
    font-size: var(--font-md);
    line-height: var(--lineheight-sm);
    background-color: var(--background-200);
  }

  &__turnstile {
    display: flex;
  }
}
</style>