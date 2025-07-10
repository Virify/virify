<template>
  <div>
    <h3 class="m-listing-card-no-wrap | body-md font-semibold">
      {{ props.classification}} {{ props.type }} 
    </h3>
    <p class="m-listing-card-location m-listing-card-no-wrap | body-xs faded-text">
      {{ props.address.street }}, {{ props.address.city }}, {{ props.address.postcode }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
address: {
  street: string;
  city: string;
  postcode: string;
};
type: string;
classification: string;
}>();

</script>

<style lang="scss">
.m-listing-card-location {
  margin-bottom: var(--size-8);
}

.m-listing-card-no-wrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .m-listing-card-no-wrap {
    white-space: normal;
  }
}
</style>
