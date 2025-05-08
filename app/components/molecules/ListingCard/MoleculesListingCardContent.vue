<template>
  <div class="m-listing-card-content | flow flow-lg" role="presentation">
    <ul class="m-listing-card-content-icons">
      <li class="| font-semibold body-xs nowrap">
        <AtomsIcon icon="cards/property-type" aria-hidden="true" class="m-listing-card-content-icon" />
        {{ propertyType }}
      </li>

      <li class="| font-semibold body-xs nowrap">
        <AtomsIcon icon="cards/beds" aria-hidden="true" class="m-listing-card-content-icon" />
        {{ bedrooms }} beds
      </li>

      <li class="| font-semibold body-xs nowrap">
        <AtomsIcon icon="cards/bathrooms" aria-hidden="true" class="m-listing-card-content-icon" />
        {{ bathrooms }} bathrooms
      </li>
    </ul>

    <NuxtLink :to="propertyUrl" role="presentation" class="m-listing-card-content-link">
      <h3 class="m-listing-card-content-price | title-md">{{ price }}</h3>

      <p class="m-listing-card-content-address | body-sm font-bold">
        {{ address }}
      </p>
    </NuxtLink>

    <div v-if="showTabs" role="presentation" class="m-listing-card-content-expanding | flow flow-md">
      <LazyMoleculesTabs class="m-listing-card-content-tabs" :options="tabContent" v-slot="{ content }">
        <p class="| body-sm">{{ content }}</p>
      </LazyMoleculesTabs>

      <div class="m-listing-card-content-agent">
        Agent Details
      </div>
    </div>

    <template v-else>
      <button @click.prevent="$emit('force-expanded')" class="m-listing-card-content-expand-button">
        <AtomsIcon icon="read-more" title="Read more dots" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showTabs?: boolean
  price?: string
  address?: string
  bedrooms?: number
  bathrooms?: number
  description?: string
  propertyUrl?: string
  propertyType?: string
}

const props = withDefaults(defineProps<Props>(), {
  showTabs: false
})

const tabContent = computed(() => {
  return [
    { label: 'Description', content: props.description },
    { label: 'Features', content: 'See all features (list format)' },
    { label: 'Amenities', content: 'The amenities, wow! (list format)' },
  ]
})
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

.m-listing-card-content-price,
.m-listing-card-content-address {
  max-width: 22ch;
  margin-inline: auto;
}

.m-listing-card-content-price {
  margin-bottom: var(--size-6);
}

.m-listing-card-content-link {
  display: block;
  text-decoration: none;
}

.m-listing-card-content-icons {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-24);
  text-align: center;
  padding: 0;
  margin-inline: auto;
}

.m-listing-card-content-icon {
  width: var(--size-32);
  height: var(--size-32);
  margin: 0 auto var(--size-6);
  color: fn.faded-color(33%);
}

.m-listing-card-content-expand-button {
  @include mq.hover {
    display: none;
  }
}

/**
 *  Agent tab
 */
.m-listing-card-content-agent {
  padding: var(--size-12);
  background: var(--blue-400);
  color: var(--monochrome-900);
  border-radius: var(--border-radius-xl);

  @include mq.hover {
    margin-top: var(--size-32);
  }
}

/**
 *  Tab fade animation
 */
.m-listing-card-content-expanding {
  interpolate-size: allow-keywords;

  transition: height, margin;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
  transition-delay: var(--delay, 0ms);
  overflow-y: clip;
  height: calc-height(max-content, size);
}

@starting-style {
  .m-listing-card-content-expanding {
    height: 0;
  }
}

/**
 *  Fade in to reduce CLS
 */
.m-listing-card-content-tabs {
  interpolate-size: allow-keywords;

  transition-property: height, opacity;
  transition-duration: var(--animation-slow);
  transition-timing-function: var(--ease-out);
  transition-delay: var(--animation-slow);
  overflow-y: clip;
  height: calc-height(max-content, size);
}

@starting-style {
  .m-listing-card-content-tabs {
    opacity: 0;
    height: 0;
  }
}
</style>