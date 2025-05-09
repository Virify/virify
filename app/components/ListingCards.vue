<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="| title-2xl lineheight-sm">{{ title }} {{ resultsLength }} </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="listing in listings" :key="listing.id" class="rounded-xl shadow-lg overflow-hidden flex flex-col relative">
        <ListingCard
          :listing="listing"
          />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  listings: {
    type: Array as PropType<ListingCardType[]>,
  },
  title: {
    type: String,
    default: "Featured Listings",
  },
});

const resultsLength = computed(() => {
  return props.listings?.length;
});
</script>
<style lang="scss">
@use "#styles/_utils/functions" as fn;

.m-listing-fav {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
