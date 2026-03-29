<template>
  <div ref="$root" class="homepage-section-ai-demo__wrapper" :class="{
    'homepage-section-ai-demo__wrapper--image': isCardVisible
  }">

    <!-- 
      Extra div needed to fix Chrome bug with faded content breaking the
      animated background gradient of the child component when applied
      directly
    -->
    <div class="homepage-section-ai-demo__fadable-content" aria-role="presentation">

      <div class="homepage-section-ai-demo | animated-gradient">
        <h3 class="homepage-section-ai-demo__title | title-sm">Describe your new home</h3>

        <p v-cloak class="homepage-section-ai-demo__text | animated-height gradient-box">
          <template v-for="{ word, isKeywords }, index of words">
            <em v-if="isKeywords" class="homepage-section-ai-demo__text-span" :class="{
              'homepage-section-ai-demo__text-span--highlighted': index <= wordsHighlighted
            }">
              {{ word }}
            </em>
            <template v-else>
              {{ word }}
            </template>
          </template>
          <span class="homepage-section-ai-demo__text-cursor" aria-hidden>_</span>
        </p>

        <Transition name="homepage-section-ai-demo__suggestions">
          <ul v-show="isSuggestionsVisible" class="homepage-section-ai-demo__suggestions">
            <li v-for="suggestion, index of suggestions" :key="suggestion" class="homepage-section-ai-demo__suggestion"
              :style="{ animationDelay: index * 40 + 'ms' }">
              <AtomsIcon icon="ai/prompt" />
              {{ suggestion }}
            </li>
          </ul>
        </Transition>
      </div>
    </div>

    <Transition name="homepage-section-ai-demo__card">
      <PropertyCardRoot v-show="isCardVisible" class="homepage-section-ai-demo__card | gradient-box"
        v-bind="propertyDetails" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { SectionId } from './HomepageSectionAiScroller.vue'
import { useIntersectionObserver, watchImmediate } from '@vueuse/core'

interface Props {
  currentSection?: SectionId
  isScrolledBefore: boolean
  isMobile: boolean
}

const props = defineProps<Props>()

const keywords = [
  '3 bedroom',
  'houses',
  'for sale',
  'south-facing gardens',
  'hospital',
  '1 mile',
  'gym',
  'park',
  'downstairs bathroom',
  'renewable energy'
]

/**
 *  Typing animation
 */
const { text, animateText, animateSkipToEnd, resetText, isTyping } = useTypingAnimation('Show me 3 bedroom houses for sale with south-facing gardens, close to hospital and within 1 mile of a gym and park with a downstairs bathroom and renewable energy source')

/**
 *  Split words by keyword, so they can be highlighted later on
 */
const words = computed(() => {
  let highlightedText = text.value

  for (const word of keywords) {
    highlightedText = highlightedText.replace(word, `__${word}__`)
  }

  return highlightedText.split('__').map((word) => {
    const isKeywords = keywords.includes(word)

    return {
      word,
      isKeywords
    }
  })
})

/**
 *  Animate highlighting individual words
 */
const wordsHighlighted = ref(0)

let interval: NodeJS.Timeout

function runHighlightWords() {
  if (wordsHighlighted.value) return

  resetHighlights(true)

  interval = setInterval(() => {
    if (wordsHighlighted.value >= words.value.length) {
      resetHighlights()

      return
    }

    // Avoiding highlighting text whilst typing animation as occurring
    // as it can look quite jarring
    if (isTyping.value) return

    wordsHighlighted.value += 1
  }, 20)
}

function forceAllHighlights() {
  wordsHighlighted.value = words.value.length
}

function resetHighlights(resetCount = false) {
  if (interval) clearInterval(interval)
  if (resetCount) wordsHighlighted.value = 0
}

/**
 *  Suggestions
 */
const suggestions = [
  '4 bedroom house with a garden for sale',
  'Studio flats for sale',
  '2+ bedroom property with a conservatory for sale',
  'Studio flat with a balcony for sale',
  'A large parcel of land for sale',
  'A 2 bed detatched cottage with a downstairs bathroom for sale'
]

const isSuggestionsVisible = ref(false)

function showSuggestions() {
  isSuggestionsVisible.value = true
}

function hideSuggestions() {
  isSuggestionsVisible.value = false
}

/**
 *  Reset
 */
function resetAnimation() {
  resetText(true)
  resetHighlights(true)
  hideSuggestions()
  hideCard()
}

/** 
 *  Toggle demo card visibility
 */
const isCardVisible = shallowRef(false)

function hideCard() {
  isCardVisible.value = false
}

function showCard() {
  isCardVisible.value = true
}

/**
 *  Do not entirely reset animation if visible
 */
const $root = useTemplateRef('$root')
const isRootVisible = shallowRef(false)

useIntersectionObserver($root, ([entry]) => {
  const { isIntersecting } = asObject(entry)

  isRootVisible.value = !!isIntersecting
})

watch(isRootVisible, (visibility) => {
  if (!visibility) resetAnimation()
})

/**
 *  Scroll events
 */
const { currentSection, isScrolledBefore, isMobile } = toRefs(props)

watchImmediate([currentSection], ([id]) => {
  if (import.meta.server) return


  // If no ID, check if scrolled
  if (!id) {
    const shouldHardReset = isMobile.value || (isScrolledBefore.value && !isRootVisible)

    shouldHardReset && resetAnimation()

    return
  }

  // Hide the card, if it exists
  hideCard()

  // Else animate the appropriate section
  if (id === 'language') {
    animateText()
    resetHighlights(true)
    hideSuggestions()
  }
  else if (id === 'prompt') {
    runHighlightWords()
    hideSuggestions()
  }
  else if (id === 'filters') {
    showSuggestions()
  }
  else {
    animateSkipToEnd()
    forceAllHighlights()
    showCard()
  }
})

/**
 *  Mock card
 */
const propertyDetails = {
  disabledInteractions: true,
  saleOrRent: 'buy' as 'buy' | 'rent',
  propertyImage: '/img/demo/demo-1.jpg',
  imageProvider: 'local',
  price: '£325,000',
  priceLabel: 'In excess of',
  overview: '3 bed detached house',
  overviewAddress: '101 Virify Street, Cardiff, CF3',
  labels: [
    'Freehold',
    'Chain-free'
  ],
  icons: [
    { icon: 'property/bedrooms', count: 3, label: 'Bedrooms' },
    { icon: 'property/bathrooms', count: 1, label: 'Bathrooms' },
    { icon: 'property/receptions', count: 2, label: 'Receptions' },
    { icon: 'property/utility', label: 'Renewables' },
    { icon: 'property/land', label: 'Garden' },
  ],
  sellerImage: undefined,
  sellerName: 'Virify',
  viewURL: undefined
}

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

.homepage-section-ai-demo {
  --radius: var(--border-radius-xl);

  padding: var(--size-14);
  background: var(--background-100);
  min-height: 30em;

  @include mq.tablet {
    --radius: var(--border-radius-2xl);

    min-height: auto;
    padding: var(--size-20);
  }

  @include mq.desktop {
    --radius: var(--border-radius-3xl);

    padding: var(--size-28);
  }

  &__wrapper {
    position: relative;
    box-sizing: border-box;
    min-height: 30em;
    isolation: isolate;
  }

  &__title {
    margin: 0 0 var(--size-8);
    font-size: var(--font-lg);

    @include mq.tablet {
      margin: 0 0 var(--size-14);
      font-size: var(--font-xl);
    }
  }

  &__text {
    --gradient-box-radius: var(--border-radius-xl);

    padding: var(--size-12) var(--size-16);
    border-radius: var(--gradient-box-radius);
    font-size: var(--font-sm);
    line-height: var(--lineheight-lg);
    margin: 0 0 var(--size-12);
    background: light-dark(var(--background-100), var(--background-200));

    @include mq.tablet {
      font-size: var(--font-md);
      margin: 0 0 var(--size-24);
    }

    @include mq.desktop {
      padding: var(--size-20) var(--size-28);
      font-size: var(--font-lg);
    }
  }

  &__text-span {
    font-style: normal;
    border: transparent;
    background-color: transparent;
    transition-property: padding,
      background-color,
      border-color;
    transition-duration: var(--animation-subtle);
    transition-timing-function: var(--ease-in-out);

    &--highlighted {
      white-space: nowrap;
      font-weight: var(--font-semibold);
      border-radius: var(--border-radius-lg);
      padding: var(--size-2) var(--size-8);
      color: light-dark(var(--primary-400), var(--monochrome-900));
      border: 1px solid var(--primary-background-200);
      background: var(--primary-background-100);
    }
  }

  &__text-cursor {
    animation: blinkDemoCursor 1s linear infinite;
  }

  &__suggestions {
    interpolate-size: allow-keywords;

    list-style: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: var(--size-4);
    padding: 0;
    margin: 0;
    transition: height var(--animation-veryslow) var(--ease-in-out);
    overflow: hidden;
  }

  &__suggestions-leave-to,
  &__suggestions-enter-from {
    height: 0;
  }

  &__suggestions-leave-active &__suggestion {
    transition: opacity var(--animation-veryslow) var(--ease-in-out);
    opacity: 0;
  }

  &__suggestion {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-6);
    font-size: var(--font-2xs);
    line-height: 1.4em;
    border: 1px solid var(--input-text-border);
    border-radius: var(--border-radius-pill);
    padding: var(--size-6) var(--size-12);
    padding-left: var(--size-8);
    font-weight: var(--font-semibold);
    animation: fadeDemoSuggestionIn var(--animation-veryslow) var(--ease-in-out) backwards;

    .a-icon {
      width: var(--size-18);
      height: var(--size-18);
      color: var(--primary-400);
      flex: 1 0 auto;
    }
  }

  &__card {
    --gradient-box-radius: var(--border-radius-3xl);

    background: var(--background-100);
    padding: var(--size-14);
    width: 90%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    transition-property: opacity, transform;
    transition-duration: var(--animation-veryslow);
    transition-timing-function: var(--ease-out);

    @media (min-width: 400px) {
      width: min(31ch, 90%);
    }

    @include mq.tablet {
      width: min(31ch, 100%);
    }

    .m-scrollbox-indicator {
      --overflow-indicator-color: var(--background-100);
    }
  }

  &__card-leave-to,
  &__card-enter-from {
    transform: translate(-50%, calc(-50% + 20vh));
    opacity: 0;
  }

  // Animate card, content
  &__fadable-content {
    transform-origin: 50% 0;
    transition-property: opacity, transform;
    transition-duration: var(--animation-veryslow);
    transition-timing-function: var(--ease-out);
  }

  &__wrapper--image &__fadable-content {
    opacity: 0.4;
    transform: scale(0.95) translateY(var(--size-16));

    @include mq.tablet {
      transform: scale(0.85);
    }
  }
}

@keyframes fadeDemoSuggestionIn {
  from {
    opacity: 0;
    transform: translateY(var(--size-24))
  }
}

@keyframes blinkDemoCursor {
  0% {
    opacity: 0;
  }

  49% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}
</style>