import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useAuth() {
  const notification = ref<string | null>(null);
  const isLoading = ref(false);
  const isSuccess = ref(false);
  const errors = ref({
    email: null as string | null,
    password: null as string | null,
  });

  async function handleFormSubmission(endpoint: string, form: { email: string; password: string }) {
    if (validateForm(form)) {
      isLoading.value = true;
      try {
        await $fetch(endpoint, {
          method: 'POST',
          body: {
            email: form.email,
            password: form.password,
          },
        });
        notification.value = 'Login successful! Redirecting to account page...';
        isSuccess.value = true;
        navigateTo('/account');
      } catch (error: any) {
        console.log(error);
        notification.value = 'Woops! ' + error.statusMessage;
      } finally {
        isLoading.value = false;
      }
    }
  }

  function clearNotification() {
    notification.value = null;
    if (isSuccess.value) {
      navigateTo('/account');
    }
  }

  function validateForm(form: { email: string; password: string }) {
    let isValid = true;
    if (!form.email) {
      errors.value.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(form.email)) {
      errors.value.email = 'Invalid email format';
      isValid = false;
    } else {
      errors.value.email = null;
    }
    if (!form.password) {
      errors.value.password = 'Password is required';
      isValid = false;
    } else {
      errors.value.password = null;
    }
    return isValid;
  }

  function validateEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  return {
    notification,
    isLoading,
    isSuccess,
    handleFormSubmission,
    clearNotification,
    errors,
  };
}