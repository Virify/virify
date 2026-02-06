<template>
  <div class="homepage-section-comms-chat" :class="{
    'homepage-section-comms-chat--seller': isSeller
  }">
    <p class="homepage-section-comms-chat__message | body-md">{{ message }}</p>

    <div class="homepage-section-comms-chat__footer | body-xs">
      <img :src="image" class="homepage-section-comms-chat__author-image" :title="`Profile picture for ${author}`" />

      <span class="homepage-section-comms-chat__author">
        {{ author }}
      </span>

      &bull;

      <time class="homepage-section-comms-chat__time">
        {{ time }}
      </time>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  image: string
  author: string,
  isSeller: boolean
  message: string
  time: string
}

defineProps<Props>()

</script>

<style lang="scss">
.homepage-section-comms-chat {
  background: var(--monochrome-700);
  color: var(--monochrome-100);
  border-radius: var(--border-radius-2xl) var(--border-radius-2xl) var(--border-radius-2xl) 0;
  margin: 0;
  padding: var(--size-14);
  width: fit-content;
  max-width: 40ch;

  &__message {
    margin: 0;
    font-weight: var(--font-semisemibold);
    padding: 0 var(--size-8);
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    margin: var(--size-12) 0 0;
    color: var(--monochrome-400);
    padding-right: var(--size-32);
    white-space: nowrap;
    overflow: hidden;
  }

  &__author-image {
    background: var(--monochrome-100);
    color: var(--monochrome-900);
    border-radius: var(--border-radius-pill);
    width: var(--size-28);
    height: var(--size-28);
    object-fit: contain;
  }

  &__author {
    font-weight: var(--font-bold)
  }

  &--seller {
    background: var(--secondary-700);
    color: var(--monochrome-100);
    border-radius: var(--border-radius-2xl) var(--border-radius-2xl) 0;
    justify-self: flex-end;
    align-self: flex-end;
  }

  &--seller &__footer {
    color: var(--secondary-300);
  }
}
</style>