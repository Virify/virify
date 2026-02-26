<template>
  <div class="v-dialog-waiting-list | flow dialog-container dialog-container-sm">
    <h1 class="| title-md">
      Join the waiting list for the property platform that works for everyone
    </h1>

    <HomepageSectionSignupForm />
  </div>
</template>

<style lang="scss">
.v-dialog-waiting-list {
  text-align: center;

  .homepage-section-signup-form {
    margin: var(--size-32) 0 0;
  }

  .homepage-section-signup-form__text-input {
    border: 1px solid var(--input-text-border);
  }
}
</style>
