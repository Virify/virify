export function useAuthForm(initialForm: { [key: string]: any }) {
  // composable imports
  const { fetch } = useUserSession();
  // references
  const form = ref(initialForm);
  const errors = ref<{ [key: string]: string | null }>({});

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
   * Uses the key of the form object to determine the field to validate
   * You can specify the validation rules for each field here if unique validation is required
   * @returns True if the form is valid, false otherwise
   */
  function validateForm() {
    let isValid = true;

    // Iterate over the keys of the form object
    for (const key in form.value) {
      if (form.value.hasOwnProperty(key)) {
        const value = form.value[key];

        // Validate email
        if (key === "email") {
          if (!value) {
            errors.value[key] = "Email is required";
            isValid = false;
          } else if (!validateEmail(value)) {
            errors.value[key] = "Invalid email format";
            isValid = false;
          } else {
            errors.value[key] = null;
          }
        }

        // Default validation for other fields
        else {
          if (!value) {
            errors.value[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
            isValid = false;
          } else {
            errors.value[key] = null;
          }
        }
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
        notification.value = error.data.statusMessage;
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
