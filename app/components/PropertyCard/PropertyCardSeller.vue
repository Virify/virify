<template>
  <PopoverRoot>
    <PopoverTrigger>
      <nuxt-img v-if="profileImage" :src="profileImage" :alt="`Profile image for ${name}`"
        class="property-card-seller__profile-image" width="40" height="40" loading="lazy" />

      <AvatarInitials v-else :name class="property-card-seller__profile-image" />
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent position-strategy="absolute" :side-offset="4"
        class="property-card-seller__popover | gradient-box body-sm">
        <nuxt-img v-if="profileImage" :src="profileImage" :alt="`Profile image for ${name}`"
          class="property-card-seller__popover-image" width="56" height="56" loading="lazy" />

        <AvatarInitials v-else :name class="property-card-seller__popover-image" />

        <span class="property-card-seller__popover-name | title-3xs">
          {{ name }}
        </span>

        <p class="| body-xs">Private seller</p>

        <p class="property-card-seller__popover-wip">
          Extended user profiles coming soon...
        </p>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from 'reka-ui'

interface Props {
  profileImage?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: 'Virify'
})

</script>

<style lang="scss">
.property-card-seller {
  position: relative;

  &__profile-image {
    width: var(--size-40);
    height: var(--size-40);
    font-size: var(--font-sm);
    border-radius: var(--border-radius-md);
    overflow: hidden;
    object-fit: contain;
  }

  &__popover {
    background: var(--background-200);
    padding: var(--size-16);
    width: 14em;
    text-align: center;
  }

  &__popover-image {
    width: var(--size-56);
    height: var(--size-56);
    margin: 0 auto var(--size-12);
    font-size: var(--font-xl);
  }

  &__popover-name {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  &__popover-wip {
    background: var(--background-400);
    color: var(--foreground-400);
    border-radius: var(--border-radius-xl);
    padding: var(--size-14) var(--size-18);
    margin: var(--size-14) 0 0;
    font-size: var(--font-xs);
    line-height: var(--lineheight-sm);
    font-weight: var(--font-semisemibold);
  }
}
</style>