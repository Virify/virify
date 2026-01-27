<template>
  <div>
    <!-- START DEBUGGER -->
    <div style="display: flex; flex-wrap: wrap; gap: 0.5em; margin: 0 0 2rem;l">
      <button class="| button button-secondary button-xs" @click.prevent="typingAnimation">
        Show typing
      </button>

      <button class="| button button-secondary button-xs" @click.prevent="runHighlightWords">
        Show highlights
      </button>

      <button class="| button button-secondary button-xs" @click.prevent="showSuggestions">
        Show suggestions
      </button>

      <button class="| button button-delete button-xs" @click.prevent="resetAnimation">
        Reset
      </button>
    </div>
    <!-- END DEBUGGER -->

    <!-- REAL CONTENT -->
    <div class="homepage-typing | animated-gradient">
      <h3 class="homepage-typing__title | title-sm">Describe your new home</h3>

      <p v-cloak class="homepage-typing__text | animated-height gradient-box">
        <template v-for="{ word, isKeywords }, index of words">
          <em v-if="isKeywords" class="homepage-typing__text-span" :class="{
            'homepage-typing__text-span--highlighted': index <= wordsHighlighted
          }">
            {{ word }}
          </em>
          <template v-else>
            {{ word }}
          </template>
        </template>
        <span class="homepage-typing__text-cursor" aria-hidden>_</span>
      </p>

      <ul v-show="isSuggestionsVisible" class="homepage-typing__suggestions | animated-height">
        <li v-for="suggestion, index of suggestions" :key="suggestion" class="homepage-typing__suggestion"
          :style="{ animationDelay: index * 40 + 'ms' }">
          <AtomsIcon icon="ai/prompt" />
          {{ suggestion }}
        </li>
      </ul>
    </div>
    <!-- END REAL CONTENT -->
  </div>
</template>

<script setup>

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
const { text, animateText, resetText, isTyping } = useTypingAnimation('Show me 3 bedroom houses for sale with south-facing gardens, close to hospital and within 1 mile of a gym and park with a downstairs bathroom and renewable energy source')

function typingAnimation() {
  resetHighlights(true)
  animateText()
}

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

let interval

function runHighlightWords() {
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
}

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-typing {
  position: relative;
  padding: var(--size-14);
  background: var(--background-200);

  @include mq.tablet {
    padding: var(--size-20);
  }

  @include mq.desktop {
    padding: var(--size-28);
  }

  &__title {
    margin: 0 0 var(--size-8);

    @include mq.tablet {
      margin: 0 0 var(--size-14);
    }
  }

  &__text {
    --gradient-box-radius: var(--border-radius-xl);

    padding: var(--size-12) var(--size-16);
    border-radius: var(--gradient-box-radius);
    font-size: var(--font-sm);
    line-height: var(--lineheight-lg);

    @include mq.tablet {
      font-size: var(--font-md);
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
      color: var(--secondary-400);
      background: var(--secondary-900);
      border-radius: var(--border-radius-lg);
      padding: var(--size-2) var(--size-8);
      border: 1px solid var(--secondary-800);
    }
  }

  &__text-cursor {
    animation: blinkDemoCursor 1s linear infinite;
  }

  &__suggestions {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: var(--size-4);
    margin: var(--size-12) 0 0;

    @include mq.tablet {
      margin: var(--size-24) 0 0;
    }
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
      color: var(--secondary-400);
      flex: 1 0 auto;
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