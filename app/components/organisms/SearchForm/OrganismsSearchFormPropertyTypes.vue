<template>
  <OrganismsSearchFormTitleBlock title="Property type">
    <MoleculesAccordionMultiselect v-for="{ name, options } of propertyTypes" :title="name" :options />
  </OrganismsSearchFormTitleBlock>
</template>

<script setup lang="ts">
import type { PropertyTypeWithOptions } from "~~/shared/types/property-type";

defineProps<{
  propertyTypes: PropertyTypeWithOptions[]
}>();

</script>

<style lang="scss">
.o-property-type-classification {
  margin-bottom: var(--size-16);
}

.o-property-type-button {
  margin-top: var(--size-16);
}
</style>