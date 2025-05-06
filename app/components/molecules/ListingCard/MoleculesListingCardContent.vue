<template>
  <div class="m-listing-card-content | flow flow-md" role="presentation">
    <h3 class="m-listing-card-content-title | title-xs">32 Someplace St., Cardiff</h3>

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

    <div v-if="showTabs" class="m-listing-card-content-tabs">
      TABS<br />TABS
    </div>

    <button v-else @click.prevent="$emit('force-expanded')" class="m-listing-card-content-expand-button">
      <AtomsIcon icon="read-more" title="Read more dots" />
    </button>

    <div class="m-listing-card-content-agent">
      Agent Details
    </div>
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

.m-listing-card-content-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-listing-card-content-icons {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-20);
  text-align: center;
  white-space: nowrap;
  padding: 0;
  margin-inline: auto;
}

.m-listing-card-content-icon {
  width: var(--size-32);
  height: var(--size-32);
  margin: 0 auto var(--size-6);
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
.m-listing-card-content-tabs {
  interpolate-size: allow-keywords;

  transition: height, margin;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
  transition-delay: var(--delay, 0ms);
  overflow-y: clip;
  margin: var(--size-16);
  height: calc-height(max-content, size);
}

@starting-style {
  .m-listing-card-content-tabs {
    height: 0;
  }
}
</style>