<template>
  <div v-if="videoId">
    <h2 class="title-md">Property Video</h2>
    <div class="p-listing-video__wrap">
      <div class="p-listing-video__frame">
        <ScriptYouTubePlayer
          :video-id="videoId"
          @state-change="onStateChange"
        />

        <div
          v-if="showPlayOverlay"
          class="p-listing-video__play-overlay"
          aria-hidden="true"
        >
          <span class="p-listing-video__play-button">
            <UIcon
              name="i-lucide-play"
              class="p-listing-video__play-glyph"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    videoId: string;
  }

  defineProps<Props>();

  const showPlayOverlay = ref(true);

  interface YouTubeStateChangeEvent {
    data?: number;
  } 

  function onStateChange(event: YouTubeStateChangeEvent) {
    // YT.PlayerState.PLAYING === 1
    showPlayOverlay.value = event.data !== 1;
  }
</script>

<style scoped lang="scss">
  .p-listing-video {
    &__wrap {
      margin-top: var(--size-16);
      border-radius: var(--border-radius-xl);
      overflow: hidden;
      background: var(--background-100);
      border: 1px solid var(--border-color, var(--background-300));
    }

    &__frame {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
    }

    &__play-overlay {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      pointer-events: none;
      background: linear-gradient(to top, rgb(0 0 0 / 28%), rgb(0 0 0 / 12%));
      transition: opacity 180ms ease;
    }

    &__play-button {
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgb(0 0 0 / 58%);
      border: 1px solid rgb(255 255 255 / 24%);
      backdrop-filter: blur(2px);
      box-shadow: 0 8px 24px rgb(0 0 0 / 22%);
    }

    &__play-glyph {
      width: 1.5rem;
      height: 1.5rem;
      color: rgb(255 255 255 / 95%);
      transform: translateX(1px);
    }

    &__frame :deep(iframe),
    &__frame :deep(video) {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
</style>
