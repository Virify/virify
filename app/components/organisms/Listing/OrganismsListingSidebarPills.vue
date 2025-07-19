<template>
  <div v-if="pills.length > 0" class="sidebar-pills">
    <AtomsPill v-for="pill in pills" :key="pill" class="| body-xs">
      <p>
        {{ pill }}
      </p>
    </AtomsPill>
  </div>
</template>

<script setup lang="ts">

interface Props {
  constructionType?: string;
  chainFree?: boolean;
  vacant?: boolean;
  yearBuilt?: string;
  propertySize?: number;
  reduced?: boolean;
}

const props = defineProps<Props>();

const pills = computed(() => {
  const pillsArray = [];

  if (props.constructionType) {
    pillsArray.push(
      `Construction Type: ${props.constructionType.toLowerCase()}`
    );
  }

  if (props.chainFree !== undefined) {
    pillsArray.push(props.chainFree ? "Chain Free" : "Chain Dependent");
  }

  if (props.vacant !== undefined) {
    pillsArray.push(props.vacant ? "Vacant" : "Occupied");
  }

  if (props.yearBuilt) {
    pillsArray.push(`${props.yearBuilt}`);
  }

  if (props.propertySize) {
    pillsArray.push(`Total Size: ${props.propertySize} m²`);
  }

  if (props.reduced) {
    pillsArray.push("Reduced");
  }

  return pillsArray;
});
</script>

<style lang="scss" scoped>
.sidebar-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-8);
  margin-bottom: var(--size-16);
  text-transform: capitalize;
}

.a-pill {
    background: var(--blue-400);
    color: var(--monochrome-900);
  }
</style>
