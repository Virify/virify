export function useAuthForm(initialForm: { email?: string; password?: string; token?: string }) {
  // composable imports
  const { fetch } = useUserSession();
  // references
  const form = ref(initialForm);
  const errors = ref({
    email: null as string | null,
    password: null as string | null,
  });

  const notification = ref<string | null>(null);
  const isLoading = ref(false);
  const isSuccess = ref(false);

  /**
   * Validates the email format
   * @param email - The email to validate
   * @returns True if the email format is valid, false otherwise
   */
  function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Validates the form fields
   * @returns True if the form is valid, false otherwise
   */
  function validateForm() {
    let isValid = true;

    // Validate email if it exists in the form
    if ("email" in form.value) {
      if (!form.value.email) {
        errors.value.email = "Email is required";
        isValid = false;
      } else if (!validateEmail(form.value.email)) {
        errors.value.email = "Invalid email format";
        isValid = false;
      } else {
        errors.value.email = null;
      }
    }

    // Validate password if it exists in the form
    if ("password" in form.value) {
      if (!form.value.password) {
        errors.value.password = "Password is required";
        isValid = false;
      } else {
        errors.value.password = null;
      }
    }

    return isValid;
  }

  /**
   * Submits the form data to the specified URL
   * @param url - The URL to submit the form data to
   * @param message - The success message to display
   */
  async function submitForm(url: string, message: string) {
    if (validateForm()) {
      isLoading.value = true;
      try {
        await $fetch(url, {
          method: "POST",
          body: form.value,
        });
        notification.value = message;
        isSuccess.value = true;
        fetch();
      } catch (error: any) {
        notification.value = `${error.statusMessage}`;
      } finally {
        isLoading.value = false;
      }
    }
  }

  /**
   * Clears the notification and optionally redirects to a specified URL
   * @param redirectUrl - The URL to redirect to after clearing the notification
   */
  function clearNotification(redirectUrl?: string) {
    notification.value = null;
    if (redirectUrl) {
      navigateTo(redirectUrl);
    }
  }

  return {
    form,
    errors,
    notification,
    isLoading,
    isSuccess,
    validateForm,
    submitForm,
    clearNotification,
  };
}
