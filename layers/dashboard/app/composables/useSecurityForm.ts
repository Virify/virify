import { z } from "zod";
import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui';

export function useSecurityForm() {
  const { user, fetch } = useUserSession();
  const toast = useToast();

  type Schema = z.output<typeof securitySchemaBase>;
  const errors = ref<FormErrorEvent | null>(null);
  const submitErrors = ref<FormError[] | null>(null);

  const showCurrentPassword = ref(false);
  const showNewPassword = ref(false);
  const showConfirmNewPassword = ref(false);

  const state = reactive<Schema>({
    email: user.value?.email || '',
    currentPassword: null,
    newPassword: null,
    confirmNewPassword: null,
  });

  // Watch for user changes to update email if it wasn't modified yet? 
  // Or just initial state. The page uses user.value?.email || ''
  
  const isUserVerified = computed(() => isVerified(user.value));

  const isChangingPassword = computed(() => {
    return !!state.currentPassword || !!state.newPassword || !!state.confirmNewPassword
  });

  const schema = computed(() => {
    if (!isUserVerified.value) {
      return securitySchemaSetPassword;
    }
    if (isChangingPassword.value) {
      return securitySchema;
    }
    return securitySchemaBase;
  });

  const isValidSubmission = computed(() => {
    const isEmailChanged = state.email !== user.value?.email;

    // For unverified users...
    if (!isUserVerified.value && !state.newPassword && !isEmailChanged) {
        return false;
    }

    if (isUserVerified.value && !isEmailChanged && !isChangingPassword.value) {
      return false;
    }

    const result = schema.value.safeParse(state);
    return result.success;
  });

  function clearSubmitErrors() {
    submitErrors.value = null;
  }

  function clearForm() {
    state.currentPassword = null;
    state.newPassword = null;
    state.confirmNewPassword = null;
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    submitErrors.value = null;
    
    // Safety check just in case
    if (!isValidSubmission.value) return;

    const querySchema = !isUserVerified.value ? 'set-password' : (isChangingPassword.value ? 'full' : 'base');

    try {
      const response = await $fetch<Schema>("/api/user/security", {
        method: "PATCH",
        body: event.data,
        query: {
          schema: querySchema,
        }
      });

      if(response) {
        toast.add({
          title: 'Success',
          description: 'Your security settings have been updated.',
          color: 'success',
        })
        await fetch();
        clearForm();
      }

    } catch (error: any) {
      if(error.status === 400) {
        submitErrors.value = [{
          name: 'newPassword',
          message: 'New password must not be the same as the current password.',
        }]
      } else if (error.status === 401) {
        submitErrors.value = [{
          name: 'currentPassword',
          message: 'Current password is incorrect.',
        }]
      } else {
        toast.add({
          title: 'Error',
          description: error.statusText || error.message || "An error occurred",
          color: 'error',
        })
      }
    }
  }

  return {
    state,
    errors,
    submitErrors,
    showCurrentPassword,
    showNewPassword,
    showConfirmNewPassword,
    isUserVerified,
    isChangingPassword,
    schema,
    isValidSubmission,
    clearSubmitErrors,
    clearForm,
    onSubmit
  };
}
