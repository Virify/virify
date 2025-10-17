<template>
  <div class="o-traditional-search-form | flow flow-xl">
    <OrganismsTraditionalSearchContract />

    <div>
      <h3 class="| title-2xs">Property type</h3>

      <OrganismsTraditionalSearchPropertyType />
    </div>

    <div style="display: flex; justify-content: space-evenly; width: 100%; gap: var(--size-12)">
      <div>
        <h3 class="| title-2xs">Bed count</h3>
        <p>Coming soon...</p>
      </div>

      <div>
        <h3 class="| title-2xs">Bathroom count</h3>
        <p>Coming soon...</p>
      </div>
    </div>

    <div>
      <h3 class="| title-2xs">Additional features</h3>
      <p>Coming soon...</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-traditional-search-form {
  padding: var(--size-8);

  @include mq.tablet {
    padding: var(--size-16);
  }
}
</style>