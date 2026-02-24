<template>
  <p v-if="hasJoinedWaitingList" class="homepage-section-signup-form__success | body-md">
    You have successfully joined our waiting list! We will keep you updated when we launch

    <button type="button" class="homepage-section-signup-form__success-button | button" @click.prevent="backToForm">
      Sign up another address
    </button>
  </p>

  <form v-else class="homepage-section-signup-form" @submit.prevent="signUpUser" novalidate>
    <input type="email" required aria-label="Email address" placeholder="Email address" name="email"
      class="homepage-section-signup-form__text-input | body-md" />

    <label class="homepage-section-signup-form__consent | body-sm">
      <AtomsCheckInput name="terms" required class="homepage-section-signup-form__consent-checkbox" />

      <span>
        I agree to the
        <nuxt-link href="/terms">
          terms &amp; conditions
        </nuxt-link>
        and
        <nuxt-link href="/privacy">
          privacy policy
        </nuxt-link>
      </span>
    </label>

    <button :disabled="isPending" type="submit"
      class="homepage-section-signup-form__button | button button-secondary body-md">
      Sign up
    </button>
  </form>
</template>

<script setup lang="ts">
import type { ErrorBoxProp } from '~/types'

/**
 *  Hide form when submission is successul
 */
const hasJoinedWaitingList = useState('hasJoinedWaitingList', () => false)

function backToForm() {
  hasJoinedWaitingList.value = false
}

/**
 *  Submit form
 */
const { isPending, setPendingWhile } = usePending();

async function signUpUser({ target }: SubmitEvent) {
  if (isPending.value) return

  setPendingWhile(async () => {
    const { errors, formData } = useFormData(target);

    // If errors exist, show them
    if (errors || !formData) {
      showErrors(errors)

      return;
    }

    // Get email address from the form
    const email = formData.get('email')

    // Submit waiting list address
    await $fetch<{ success: boolean; message: string; alreadyExists?: boolean }>("/api/waiting-list", {
      method: "POST",
      body: {
        email,
      },
    }).then(() => {
      hasJoinedWaitingList.value = true
    }).catch(showGenericError)
  })
}

/**
 *  Show errors
 */
const toast = useToast();

function showGenericError() {
  toast.add({
    title: 'Submission error',
    description: 'There was an error with your form - please check all fields and try again',
    color: 'error'
  })
}

function showErrors(errors?: ErrorBoxProp) {
  const { list } = asObject(errors)

  // If the error list cannot be parsed, show a generic error
  if (!Array.isArray(list)) {
    showGenericError()

    return
  }

  // Otherwise loop through each error and show a usefull error message
  for (const error of list) {
    const { type, message } = asObject(error)

    if (type === 'terms') {
      toast.add({
        title: 'Terms and conditions',
        description: 'Please confirm you agree to our terms and conditions before proceeding',
        color: 'error'
      })
    }

    else if (type === 'email') {
      toast.add({
        title: 'Email address',
        description: message,
        color: 'error'
      })
    }

    else {
      showGenericError()
    }
  }
}

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-signup-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--size-20);
  width: 100%;
  margin: 0;
  padding: 0;

  &__text-input {
    background: var(--monochrome-900);
    color: var(--monochrome-100);
    padding: var(--size-16) var(--size-28);
    width: min(100%, 38ch);
    border-radius: var(--border-radius-xl);
    box-sizing: border-box;

    &:user-invalid:not(:placeholder-shown):not(:focus) {
      background-color: var(--error-background);
      color: var(--error-foreground);
    }
  }

  &__consent {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: var(--font-semisemibold);
    cursor: pointer;
    line-height: var(--lineheight-sm);
    font-size: var(--font-xs);
    text-align: left;

    @include mq.tablet {
      font-size: var(--font-sm);
    }

    a {
      text-decoration: none;
      color: var(--secondary-400);
      font: inherit;
    }
  }

  &__consent-checkbox {
    margin-right: var(--size-12);
    border-color: #788792; // @TODO replace with new colours once supported
    width: var(--size-20);
    height: var(--size-20);

    @include mq.tablet {
      width: var(--size-24);
      height: var(--size-24);
    }
  }

  &__button {
    padding: var(--size-12) var(--size-28);
  }

  /**
   *  Success message
   */
  &__success {
    padding: var(--size-20) var(--size-24) var(--size-24);
    font-weight: var(--font-semisemibold);
    background: light-dark(var(--success-background), var(--success-foreground));
    color: var(--monochrome-100);
    border-radius: var(--border-radius-2xl);
    box-sizing: border-box;
    width: min(100%, 42ch);
    margin: 0 auto;
    text-align: center;

    @include mq.tablet {
      padding: var(--size-24) var(--size-36) var(--size-28);
    }
  }

  &__success-button {
    margin: var(--size-16) 0 0;
    background: light-dark(var(--success-foreground), var(--success-foreground-hover));
    color: light-dark(var(--monochrome-900), var(--monochrome-100));
    padding-left: var(--size-24);
    padding-right: var(--size-24);

    @include mq.tablet {
      margin: var(--size-20) 0 0;
    }

    &:hover {
      background: light-dark(var(--success-foreground), var(--success-foreground-hover));
      color: light-dark(var(--monochrome-900), var(--monochrome-100));
    }
  }
}
</style>