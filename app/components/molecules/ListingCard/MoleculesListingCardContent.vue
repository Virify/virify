<template>
  <div class="m-listing-card-content | flow flow-md" role="presentation">
    <ul class="m-listing-card-content-icons">
      <li class="| font-semibold body-xs">
        <AtomsIcon icon="cards/property-type" aria-hidden="true" class="m-listing-card-content-icon" />
        Detatched
      </li>

      <li class="| font-semibold body-xs">
        <AtomsIcon icon="cards/beds" aria-hidden="true" class="m-listing-card-content-icon" />
        3 beds
      </li>

      <li class="| font-semibold body-xs">
        <AtomsIcon icon="cards/bathrooms" aria-hidden="true" class="m-listing-card-content-icon" />
        2 bathrooms
      </li>
    </ul>

    <h3 class="m-listing-card-content-title | title-xs">
      32 Someplace Longname St, Cardiff
    </h3>

    <div v-if="showTabs" role="presentation" class="m-listing-card-content-expanding | flow flow-md">
      <LazyMoleculesListingCardTabs hydrate-on-visible />

      <p class="| body-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae officiis minus numquam ut
        aliquam quis ab</p>

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
}

withDefaults(defineProps<Props>(), {
  showTabs: false
})
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

.m-listing-card-content-title {
  max-width: 20ch;
  margin-inline: auto;
}

.m-listing-card-content-icons {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-24);
  text-align: center;
  white-space: nowrap;
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
</style>