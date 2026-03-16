<template>
  <div class="m-results-placeholder">
    <div class="m-results-placeholder__icon">
      <AtomsIcon icon="listings/savings" :size="64" />
    </div>
    <h3 class="| title-md">Your Results</h3>
    <p class="| body-md text-muted">
      Complete the steps to see your estimated monthly payments across different mortgage types.
    </p>

    <ul class="m-results-placeholder__features">
      <li>
        <AtomsIcon icon="tick" :size="16" />
        <span class="| body-sm">Fixed, tracker &amp; variable rate comparisons</span>
      </li>
      <li>
        <AtomsIcon icon="tick" :size="16" />
        <span class="| body-sm">Monthly payment breakdown</span>
      </li>
      <li>
        <AtomsIcon icon="tick" :size="16" />
        <span class="| body-sm">Total interest calculations</span>
      </li>
    </ul>

    <div class="m-results-placeholder__info">
      <AtomsIcon icon="property/info" :size="16" />
      <span class="| body-sm text-muted">
        Based on current UK average rates
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed - purely presentational
</script>

<style lang="scss" scoped>
.m-results-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--size-12);
  padding: var(--size-16) 0;

  h3 {
    margin-top: var(--size-12);
  }

  &__icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--background-200);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--foreground-300);
  }

  &__features {
    list-style: none;
    padding: 0;
    margin: var(--size-24) 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-12);
    text-align: left;
    width: 100%;

    li {
      display: flex;
      align-items: center;
      gap: var(--size-12);
      padding: var(--size-12) var(--size-16);
      background: var(--background-200);
      border-radius: var(--border-radius-md);

      svg {
        color: var(--primary-300);
        flex-shrink: 0;
      }
    }
  }

  &__info {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    margin-top: var(--size-8);
    padding: var(--size-12) var(--size-16);
    background: var(--background-200);
    border-radius: var(--border-radius-md);
  }
}
</style>
