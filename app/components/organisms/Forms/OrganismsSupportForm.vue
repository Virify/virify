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
      <AtomsTextarea :id name="details" v-model="formDetails" rows="5" required placeholder="Please describe your issue or question in detail."
        class="o-support-form__textarea" />
    </MoleculesFormField>

    <button type="submit" class="button button-secondary" :disabled="disableSubmit">
      Submit Request
    </button>
  </MoleculesForm>
</template>
<script lang="ts" setup>
  import type { AtomsInput } from '#components';
  import type { ErrorBoxProp } from '~/types';

  const nameInput = ref<InstanceType<typeof AtomsInput> | null>(null);
  const emailInput = ref<InstanceType<typeof AtomsInput> | null>(null);
  const formName = ref("");
  const formEmail = ref("");
  const formType = ref("");
  const formDetails = ref("");
  const formErrors = ref<ErrorBoxProp | null>(null);

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

  function submitForm(event: Event) {
    const form = event.target as HTMLFormElement;
    const { errors, formData } = useFormData(form);
    
    if (errors) {
      formErrors.value = errors;
      return;
    }
    
    // Clear any previous errors
    formErrors.value = null;
    
    // Handle form submission with formData
    console.log("Form submitted", Object.fromEntries(formData!.entries()));
  }
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
  }
</style>