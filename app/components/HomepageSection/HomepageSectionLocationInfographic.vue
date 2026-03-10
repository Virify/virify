<template>
  <div class="homepage-section-location-infographic" :class="{
    'homepage-section-location-infographic--has-modal': showSaveModal
  }">
    <div class="homepage-section-location-infographic__input | gradient-box">
      {{ locationInputContent }}
    </div>

    <div class="homepage-section-location-infographic__dropdown | gradient-box" :class="{
      'homepage-section-location-infographic__dropdown--hidden': !showSuggestions
    }">
      <span class="| title-3xs faded-text">
        Suggestions
      </span>

      <ul class="homepage-section-location-infographic__suggestions">
        <li v-for="{ label, pin } of suggestions"
          class="homepage-section-location-infographic__suggestion-item | body-md">
          <span class="homepage-section-location-infographic__suggestion-location">{{ label }}</span>

          <span v-if="pin" class="homepage-section-location-infographic__suggestion-saved | body-xs">{{ pin }}</span>
          <AtomsIcon v-else icon="search/pin" class="homepage-section-location-infographic__suggestion-pin" />
        </li>
      </ul>

      <span class="| title-3xs faded-text">
        Saved Locations
      </span>

      <ul class="homepage-section-location-infographic__saved">
        <li>
          Home
        </li>
      </ul>
    </div>

    <div class="homepage-section-location-infographic__modal | gradient-box" :class="{
      'homepage-section-location-infographic__modal--hidden': !showSaveModal
    }">
      <AtomsIcon icon="cross" class="homepage-section-location-infographic__modal-close " />

      <span class="| faded-text body-sm">
        Name
      </span>

      <span class="homepage-section-location-infographic__modal-input | body-md">{{ savedInputContent }}</span>

      <div class="homepage-section-location-infographic__modal-buttons">
        <span
          class="homepage-section-location-infographic__modal-button homepage-section-location-infographic__modal-button--ghost | body-xs">
          Cancel
        </span>

        <span class="homepage-section-location-infographic__modal-button | body-xs" :class="{
          'homepage-section-location-infographic__modal-button--clicked': savedButtonActive
        }">
          Save
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const locationInputContent = shallowRef('Cardiff')
const savedInputContent = shallowRef('')
const showSuggestions = shallowRef(true)
const savedButtonActive = shallowRef(false)
const showSaveModal = shallowRef(false)

/**
 *  Suggestions
 */
const suggestions = [
  {
    label: 'Cardiff City Center, Cardiff, United Kingdom',
    pin: 'Work'
  },
  { label: 'Cardiff Gate, Cardiff, United Kingdom' },
  { label: 'Cardiff Castle, Cardiff, United Kingdom' }
]

/**
 *  Animation test
 */
const timestamps = [
  {
    start: 0,
    action() {
      locationInputContent.value = ''
      savedInputContent.value = ''
      showSuggestions.value = false
    }
  },
  {
    start: 1000,
    action() {
      locationInputContent.value += 'C'
    }
  },
  {
    start: 1050,
    action() {
      locationInputContent.value += 'a'
    }
  },
  {
    start: 1070,
    action() {
      locationInputContent.value += 'r'
    }
  },
  {
    start: 1100,
    action() {
      locationInputContent.value += 'd'
    }
  },
  {
    start: 1140,
    action() {
      locationInputContent.value += 'i'
    }
  },
  {
    start: 1200,
    action() {
      locationInputContent.value += 'f'
    }
  },
  {
    start: 1240,
    action() {
      locationInputContent.value += 'f'
    }
  },
  {
    start: 1400,
    action() {
      showSuggestions.value = true
    }
  },
  {
    start: 2800,
    action() {
      showSaveModal.value = true
    }
  },
  {
    start: 3400,
    action() {
      savedInputContent.value += 'N'
    }
  },
  {
    start: 3450,
    action() {
      savedInputContent.value += 'e'
    }
  },
  {
    start: 3530,
    action() {
      savedInputContent.value += 'a'
    }
  },
  {
    start: 3560,
    action() {
      savedInputContent.value += 'r'
    }
  },
  {
    start: 3600,
    action() {
      savedInputContent.value += ' '
    }
  },
  {
    start: 3630,
    action() {
      savedInputContent.value += 'S'
    }
  },
  {
    start: 3660,
    action() {
      savedInputContent.value += 'u'
    }
  },
  {
    start: 3700,
    action() {
      savedInputContent.value += 'e'
    }
  },
  {
    start: 4200,
    action() {
      savedButtonActive.value = true
    }
  },
  {
    start: 4280,
    action() {
      savedButtonActive.value = false
    }
  },
  {
    start: 4600,
    action() {
      showSaveModal.value = false
    }
  },
]

const { start } = useTimestampAnimation(timestamps, {
  duration: 6000
})

// onMounted(() => {
//   start()
// })

</script>

<style lang="scss">
.homepage-section-location-infographic {
  position: relative;
  width: min(100%, 30rem);
  margin: 0 auto;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    opacity: 0;
    background: var(--background-100);
    pointer-events: none;
    transition: opacity var(--animation-subtle);
  }

  &--has-modal::before {
    opacity: 0.85;
  }

  &__input,
  &__dropdown {
    background: var(--background-200);
    color: currentColor;
    width: 100%;
    box-sizing: border-box;
  }

  &__input {
    margin: 0 0 var(--size-12);
    padding: var(--size-18) var(--size-24);

    &:empty {
      color: var(--monochrome-500);

      &::before {
        content: 'Where do you want to live?'
      }
    }
  }

  &__dropdown {
    margin: 0 0 var(--size-12);
    padding: var(--size-14) var(--size-24);

    &--hidden {
      opacity: 0;
    }
  }

  &__suggestions,
  &__saved {
    list-style: none;
    padding: var(--size-8) 0;
  }

  &__suggestions {
    margin: 0 0 var(--size-24);
  }

  &__saved {
    margin: 0;
  }

  &__suggestion-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--size-8) var(--size-16);
    gap: var(--size-12);
  }

  &__suggestion-location {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__suggestion-saved {
    display: block;
    background: light-dark(var(--monochrome-800), var(--monochrome-300));
    color: light-dark(var(--monochrome-100), var(--monochrome-900));
    flex-shrink: 0;
    padding: var(--size-6) var(--size-12);
    border-radius: var(--border-radius-pill);
  }

  &__suggestion-pin {
    flex-shrink: 0;
    padding: var(--size-6);
    width: var(--size-20);
    height: var(--size-20);
    box-sizing: content-box;
    border-radius: var(--border-radius-pill);
  }

  &__modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--background-200);
    padding: var(--size-16);
    width: min(100%, 12em);
    z-index: 3;
    transition: opacity, transform;
    transition-duration: var(--animation-subtle);
    transition-timing-function: var(--ease-in-out);

    &--hidden {
      opacity: 0;
      transform: translate(-50%, calc(50% + var(--size-12)))
    }
  }

  &__modal-close {
    position: absolute;
    top: var(--size-12);
    right: var(--size-12);
    width: var(--size-20);
    height: var(--size-20);
  }

  &__modal-input {
    display: block;
    border: 1px solid var(--input-text-border);
    padding: var(--size-8) var(--size-16);
    border-radius: var(--border-radius-ui);
    overflow: hidden;
    text-overflow: ellipsis;

    &:empty {
      color: var(--monochrome-500);

      &::before {
        content: 'e.g. Home'
      }
    }
  }

  &__modal-buttons {
    margin: var(--size-12) 0 0;
    display: flex;
    gap: var(--size-8);
    align-items: center;
    justify-content: stretch;
  }

  &__modal-button {
    display: block;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    padding: var(--size-8);
    font-weight: var(--font-bold);
    background: var(--secondary-400);
    color: var(--monochrome-900);
    border-radius: var(--border-radius-ui);

    &--ghost {
      background: transparent;
      border: 1px solid var(--input-text-border);
      color: currentColor;
    }

    &--clicked {
      background-color: var(--secondary-500);
      outline: 2px solid var(--secondary-400);
    }
  }
}
</style>