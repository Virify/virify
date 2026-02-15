<template>
  <form class="homepage-section-signup-form" @submit.prevent="signUpUser">
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

    <button type="submit" class="homepage-section-signup-form__button | button button-secondary body-md">
      Join waiting list
    </button>
  </form>
</template>

<script setup>
function signUpUser() {
  console.log('POST')
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
}
</style>