<template>
  <div ref="$root" class="homepage-section-location-infographic" :class="{
    'homepage-section-location-infographic--has-modal': showSaveModal
  }">
    <div class="homepage-section-location-infographic__input | gradient-box">
      <span>{{ locationInputContent }}</span>

      <div class="homepage-section-location-infographic__location | body-sm">
        {{ selectedRadius }}

        <AtomsIcon icon="chevron-down" />

        <ul class="homepage-section-location-infographic__location-dropdown | gradient-box body-sm" :class="{
          'homepage-section-location-infographic__location-dropdown--hidden': !radiusDropdownOpen
        }">
          <li v-for="{ key }, index of radiusOptions" :class="{
            'homepage-section-location-infographic__location-radius--active': radiusSelectedIndex === index
          }">
            {{ key }}
          </li>
        </ul>
      </div>
    </div>

    <div class="homepage-section-location-infographic__dropdown | gradient-box" :class="{
      'homepage-section-location-infographic__dropdown--hidden': !showSuggestions
    }">
      <span class="| title-3xs faded-text">
        Suggestions
      </span>

      <ul class="homepage-section-location-infographic__suggestions">
        <li v-for="{ label, pin }, index of suggestions"
          class="homepage-section-location-infographic__suggestion-item | body-md" :class="{
            'homepage-section-location-infographic__suggestion-item--highlighted': selectedLocationIndex === index
          }">
          <span class="homepage-section-location-infographic__suggestion-location">{{ label }}</span>

          <span v-if="pin" class="homepage-section-location-infographic__suggestion-saved | body-xs">{{ pin }}</span>
          <AtomsIcon v-else icon="search/pin" class="homepage-section-location-infographic__suggestion-pin" :class="{
            'homepage-section-location-infographic__suggestion-pin--active': showModalButtonActive && index === 2
          }" />
        </li>
      </ul>

      <span class="| title-3xs faded-text">
        Saved Locations
      </span>

      <ul class="homepage-section-location-infographic__saved">
        <li v-for="location of savedLocations">
          <span class="homepage-section-location-infographic__saved-pill | body-xs">
            <AtomsIcon icon="search/pin" class="homepage-section-location-infographic__saved-pill-icon" />
            {{ location }}
          </span>
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
import { useIntersectionObserver } from '@vueuse/core'

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
 *  Radius options
 */
const { radiusOptions } = getSearchFormConfig()

/**
 *  Reactive data
 */
const locationInputContent = shallowRef(suggestions[0]!.label)
const savedInputContent = shallowRef('')
const showSuggestions = shallowRef(true)
const savedButtonActive = shallowRef(false)
const showModalButtonActive = shallowRef(false)
const showSaveModal = shallowRef(false)
const selectedLocationIndex = shallowRef(1)
const savedLocations = ref(['Work', 'Home'])
const selectedRadius = shallowRef(radiusOptions[0]!.key)
const radiusSelectedIndex = shallowRef(0)
const radiusDropdownOpen = shallowRef(true)

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
      selectedLocationIndex.value = -1
      radiusSelectedIndex.value = -1
      showSaveModal.value = false
      savedLocations.value = ['Work']
      radiusDropdownOpen.value = false
      selectedRadius.value = radiusOptions[0]!.key
    }
  },
  {
    start: 1100,
    action() {
      locationInputContent.value += 'C'
    }
  },
  {
    start: 1220,
    action() {
      locationInputContent.value += 'a'
    }
  },
  {
    start: 1300,
    action() {
      locationInputContent.value += 'r'
    }
  },
  {
    start: 1420,
    action() {
      locationInputContent.value += 'd'
    }
  },
  {
    start: 1500,
    action() {
      locationInputContent.value += 'i'
    }
  },
  {
    start: 1620,
    action() {
      locationInputContent.value += 'f'
    }
  },
  {
    start: 1700,
    action() {
      locationInputContent.value += 'f'
    }
  },
  {
    start: 1900,
    action() {
      showSuggestions.value = true
    }
  },
  {
    start: 2800,
    action() {
      selectedLocationIndex.value = 0
    }
  },
  {
    start: 3100,
    action() {
      selectedLocationIndex.value = 1
    }
  },
  {
    start: 3200,
    action() {
      selectedLocationIndex.value = 2
    }
  },
  {
    start: 3700,
    action() {
      selectedLocationIndex.value = -1
      showModalButtonActive.value = true
    }
  },
  {
    start: 3780,
    action() {
      showModalButtonActive.value = false
    }
  },
  {
    start: 3800,
    action() {
      showSaveModal.value = true
    }
  },
  {
    start: 4400,
    action() {
      savedInputContent.value += 'N'
    }
  },
  {
    start: 4450,
    action() {
      savedInputContent.value += 'e'
    }
  },
  {
    start: 4530,
    action() {
      savedInputContent.value += 'a'
    }
  },
  {
    start: 4560,
    action() {
      savedInputContent.value += 'r'
    }
  },
  {
    start: 4600,
    action() {
      savedInputContent.value += ' '
    }
  },
  {
    start: 4630,
    action() {
      savedInputContent.value += 'S'
    }
  },
  {
    start: 4660,
    action() {
      savedInputContent.value += 'u'
    }
  },
  {
    start: 4700,
    action() {
      savedInputContent.value += 'e'
    }
  },
  {
    start: 5200,
    action() {
      savedButtonActive.value = true
    }
  },
  {
    start: 5280,
    action() {
      savedButtonActive.value = false
    }
  },
  {
    start: 5600,
    action() {
      showSaveModal.value = false
      selectedLocationIndex.value = 2
    }
  },
  {
    start: 6000,
    action() {
      savedLocations.value.push('Near Sue')
    }
  },
  {
    start: 6300,
    action() {
      selectedLocationIndex.value = -1
    }
  },
  {
    start: 6400,
    action() {
      selectedLocationIndex.value = 2
    }
  },
  {
    start: 6500,
    action() {
      const { label } = asObject(suggestions.at(-1))

      locationInputContent.value = label as string
      selectedLocationIndex.value = -1
      showSuggestions.value = false
    }
  },
  {
    start: 7500,
    action() {
      radiusDropdownOpen.value = true
    }
  },
  {
    start: 8000,
    action() {
      radiusSelectedIndex.value = 1;
    }
  },
  {
    start: 8050,
    action() {
      radiusSelectedIndex.value = 2;
    }
  },
  {
    start: 8100,
    action() {
      radiusSelectedIndex.value = 3;
    }
  },
  {
    start: 8150,
    action() {
      radiusSelectedIndex.value = 4;
    }
  },
  {
    start: 8200,
    action() {
      radiusSelectedIndex.value = 5;
    }
  },
  {
    start: 8600,
    action() {
      radiusSelectedIndex.value = -1;
    }
  },
  {
    start: 8680,
    action() {
      radiusSelectedIndex.value = 5;
    }
  },
  {
    start: 8800,
    action() {
      radiusDropdownOpen.value = false
      selectedRadius.value = radiusOptions[5]!.key
    }
  },
]

const { start, stop } = useTimestampAnimation(timestamps, {
  duration: 10000
})

/**
 *  Only run animation when visible
 */
const $root = useTemplateRef('$root')

useIntersectionObserver($root, ([entry]) => {
  const { isIntersecting } = asObject(entry)

  if (isIntersecting) {
    start()
  }
  else {
    stop()
  }
})

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-location-infographic {
  position: relative;
  width: min(100%, 36rem);
  min-height: 28rem;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    opacity: 0;
    background: var(--background-200);
    pointer-events: none;
    transition: opacity var(--animation-subtle);
  }

  &--has-modal::before {
    opacity: 0.85;
  }

  &__input,
  &__dropdown {
    background: var(--background-100);
    color: currentColor;
    width: 100%;
    box-sizing: border-box;
  }

  &__input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 var(--size-12);
    padding: var(--size-18) var(--size-24);
    gap: var(--size-8);

    >span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:empty {
        color: var(--monochrome-500);

        &::before {
          content: 'Where do you want to live?'
        }
      }
    }
  }

  &__location {
    display: flex;
    align-items: center;
    gap: var(--size-6);
    position: relative;
    padding: var(--size-10);
    padding-left: var(--size-14);
    background: var(--background-200);
    border: 1px solid var(--input-text-border);
    border-radius: var(--border-radius-ui);
    font-weight: var(--font-semisemibold);
    white-space: nowrap;

    .a-icon {
      display: block;
      width: var(--size-24);
      height: var(--size-24);
    }

    ul {
      list-style: none;
      position: absolute;
      top: calc(100% + var(--size-12));
      right: 0;
      min-width: max(12ch, 100%);
      z-index: 4;
      background: var(--background-100);
      padding: var(--size-10);
      margin: 0;
    }

    li {
      white-space: nowrap;
      font-weight: var(--font-semisemibold);
      padding: var(--size-8) var(--size-14);
      border-radius: var(--border-radius-ui);
    }
  }

  &__location-dropdown {
    transition: opacity, transform;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-in-out);

    &--hidden {
      opacity: 0;
      transform: translateY(-2rem);
    }
  }

  &__location-radius--active {
    background-color: var(--primary-400);
    color: var(--monochrome-900);
  }

  &__dropdown {
    margin: 0 0 var(--size-12);
    padding: var(--size-14) var(--size-24);
    transition: opacity, transform;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-in-out);

    &--hidden {
      transform: translateY(-1rem);
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
    border-radius: var(--border-radius-ui);

    &--highlighted {
      background-color: var(--background-200);
    }
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

    &--active {
      background: light-dark(var(--monochrome-800), var(--monochrome-300));
    }
  }

  &__saved {
    display: flex;
    gap: var(--size-8);
    flex-wrap: wrap;
  }

  &__saved-pill {
    display: flex;
    align-items: center;
    padding: var(--size-6) var(--size-14) var(--size-6) var(--size-10);
    border: 1px solid var(--input-text-border);
    border-radius: var(--border-radius-pill);
    font-weight: var(--font-semisemibold);
    gap: var(--size-4);
  }

  &__saved-pill-icon {
    display: block;
    color: var(--primary-500);
    width: var(--size-20);
    height: var(--size-20);
  }

  &__modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--background-100);
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
    background: var(--primary-400);
    color: var(--monochrome-900);
    border-radius: var(--border-radius-ui);

    &--ghost {
      background: transparent;
      border: 1px solid var(--input-text-border);
      color: currentColor;
    }

    &--clicked {
      background-color: var(--primary-500);
      outline: 2px solid var(--primary-400);
    }
  }
}
</style>