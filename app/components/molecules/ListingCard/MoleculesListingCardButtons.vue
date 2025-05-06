<template>
  <div class="m-listing-card-buttons">
    <button type="button">
      <AtomsIcon icon="cards/notes" class="m-listing-card-button-icon" />
    </button>

    <button type="button">
      <AtomsIcon icon="cards/favourite" class="m-listing-card-button-icon" />
    </button>
  </div>
</template>

<style>
.m-listing-card-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-8);
  padding: var(--size-8) var(--size-16);
  border: 1px solid var(--background-300);
  background: var(--background-200);
  width: fit-content;
  border-radius: var(--border-radius-pill)
}

.m-listing-card-button-icon {
  width: var(--size-28);
  height: var(--size-28);
}
</style>