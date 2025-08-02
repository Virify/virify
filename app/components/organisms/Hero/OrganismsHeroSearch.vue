<template>
  <div class="ai-search-hero">
    <div class="ai-search-hero-content">
      <h1 class="ai-search-hero-title | title-2xl lineheight-xs">
        Find Your Perfect Home with <GradientText>Virify AI</GradientText>
      </h1>

      <p class="ai-search-hero-subtitle">Describe your dream home in your own words. Our AI does the rest—matching you with the best properties, fast.</p>

      <!-- Functional Search Input -->
      <form @submit.prevent="handleSearch" class="ai-search-hero-search">
        <div class="ai-search-hero-input-container" ref="inputContainer">
          <input v-model="searchQuery" type="text" class="ai-search-hero-input" :placeholder="currentText" @focus="handleInputFocus" @blur="handleInputBlur" ref="searchInput" />
          <!-- Hidden span to measure text width -->
          <span ref="textMeasure" class="ai-search-hero-text-measure" v-if="currentText">{{ currentText }}</span>
          <span v-if="!isFocused && !searchQuery && currentText" class="ai-search-hero-cursor" :class="{ blinking: isBlinking }" :style="{ left: `calc(var(--size-20) + ${textWidth}px)` }">|</span>
          <button type="submit" class="ai-search-hero-submit | button-lg" @click="selectSuggestion(searchQuery)">
            <AtomsIcon icon="search" title="search" />
          </button>
        </div>
      </form>

      <AtomsDivider text="try these searches" class="ai-search-hero-divider" />

      <div role="presentation" class="ai-search-hero-footer-links">
        <MoleculesIconLink class="ai-search-hero-footer-link" icon="property/house" content="3 bedroom house" icon-inline @click="selectSuggestion('3 bedroom house')" />
        <MoleculesIconLink class="ai-search-hero-footer-link" icon="property/flat" content="House in Cardiff city centre" icon-inline @click="selectSuggestion('house in Cardiff city centre')" />
        <MoleculesIconLink class="ai-search-hero-footer-link" icon="property/house" content="House with modern kitchen" icon-inline @click="selectSuggestion('house with modern kitchen and breakfast bar')" />
        <MoleculesIconLink class="ai-search-hero-footer-link" icon="property/flat" content="Flat with balcony and parking" icon-inline @click="selectSuggestion('flat with balcony and parking')" />
        <MoleculesIconLink class="ai-search-hero-footer-link" icon="property/house" content="Property with garden and garage" icon-inline @click="selectSuggestion('property with garden and garage')" />
        <MoleculesIconLink class="ai-search-hero-footer-link" icon="property/house" content="Pet friendly house with garden" icon-inline @click="selectSuggestion('pet friendly house with garden')" />
      </div>

      <AtomsDivider text="or" class="o-hero-home-divider" />

      <div role="presentation" class="o-hero-home-footer-links">
        <MoleculesIconLink class="o-hero-home-footer-link" to="/search/legacy" icon="explore/ai" content="Traditional search" icon-inline />
        <MoleculesIconLink class="o-hero-home-footer-link" to="/map-search/" icon="explore/map" content="Search by map" icon-inline />
      </div>
    </div>
  </div>
</template>

<script setup>

// Define emits for communicating with parent
const emit = defineEmits(["selectSuggestion"]);

// Typing animation suggestions
const suggestions = [
  "3 bedroom house with garage",
  "Penthouse flat with parking and reception",
  "Modern apartment near train station",
  "Detached house with garden and EV charging",
  "Furnished rental under £1000 per month",
  "Detached house with a bedroom at least 20 sqft",
];

// Reactive data
const searchQuery = ref("");
const currentText = ref("");
const currentSuggestionIndex = ref(0);
const isTyping = ref(true);
const isBlinking = ref(true);
const isFocused = ref(false);
const searchInput = ref(null);
const inputContainer = ref(null);
const textMeasure = ref(null);
const textWidth = ref(0);
let blinkingInterval = null;

// Animation timing
const TYPING_SPEED = 100; // ms per character
const DELETING_SPEED = 50; // ms per character
const PAUSE_BETWEEN_SUGGESTIONS = 2000; // ms
const CURSOR_BLINK_SPEED = 500; // ms

const scrollInputToCursor = () => {
  if (inputContainer.value) {
    inputContainer.value.scrollLeft = inputContainer.value.scrollWidth;
  }
};

const typeText = async (text) => {
  isBlinking.value = false;

  // Type the text
  for (let i = 0; i <= text.length; i++) {
    currentText.value = text.substring(0, i);
    await updateTextWidth();
    scrollInputToCursor();
    await new Promise((resolve) => setTimeout(resolve, TYPING_SPEED));
  }

  // Pause at the end
  await new Promise((resolve) => setTimeout(resolve, PAUSE_BETWEEN_SUGGESTIONS));

  // Delete the text
  for (let i = text.length; i >= 0; i--) {
    currentText.value = text.substring(0, i);
    await updateTextWidth();
    scrollInputToCursor();
    await new Promise((resolve) => setTimeout(resolve, DELETING_SPEED));
  }

  // Brief pause before next suggestion
  await new Promise((resolve) => setTimeout(resolve, 500));

  isBlinking.value = true;
};

const updateTextWidth = async () => {
  await nextTick();
  if (textMeasure.value) {
    textWidth.value = textMeasure.value.getBoundingClientRect().width;
  }
};

const startTypingAnimation = async () => {
  while (isTyping.value) {
    const currentSuggestion = suggestions[currentSuggestionIndex.value];
    await typeText(currentSuggestion);
    currentSuggestionIndex.value = (currentSuggestionIndex.value + 1) % suggestions.length;
  }
};

const startBlinkingCursor = () => {
  blinkingInterval = setInterval(() => {
    if (isBlinking.value) {
      // Toggle cursor visibility
      const cursor = document.querySelector(".ai-search-hero-cursor");
      if (cursor) {
        cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
      }
    }
  }, CURSOR_BLINK_SPEED);
};

const scrollToSearch = (e) => {
  e.preventDefault();
  const searchElement = document.querySelector("form");
  if (searchElement) {
    searchElement.scrollIntoView({ behavior: "smooth" });
  }
};

const selectSuggestion = (suggestion) => {
  emit("selectSuggestion", suggestion);
  scrollToSearch({ preventDefault: () => {} });
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit("selectSuggestion", searchQuery.value.trim());
  }
};

const handleInputFocus = () => {
  isFocused.value = true;
  isBlinking.value = false;
};

const handleInputBlur = () => {
  isFocused.value = false;
  if (!searchQuery.value) {
    isBlinking.value = true;
  }
};

// Watch for changes in search query to hide cursor when typing
watch(searchQuery, (newValue) => {
  if (newValue) {
    isBlinking.value = false;
  } else if (!isFocused.value) {
    isBlinking.value = true;
  }
});

// Watch for changes in currentText to update cursor position
watch(currentText, () => {
  updateTextWidth();
});

onMounted(() => {
  startTypingAnimation();
  startBlinkingCursor();
  updateTextWidth();
});

onUnmounted(() => {
  isTyping.value = false;
  if (blinkingInterval) {
    clearInterval(blinkingInterval);
  }
});
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;

.ai-search-hero {
  background: var(--blue-400);
  color: var(--monochrome-900);
  border-radius: var(--border-radius-3xl);
  min-height: max(500px, 60vh);
  margin-bottom: var(--size-32);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-56) var(--size-20);

  @include mq.tablet {
    padding: var(--size-72) var(--size-32);
    background: url("/img/logo-background.svg") no-repeat top right, linear-gradient(70deg, var(--blue-300), var(--blue-400));
    background-size: auto 120%, cover;
  }
}

.ai-search-hero-submit {
  background: none;
  border: none;
  color: var(--monochrome-900);
  cursor: pointer;
  display: flex
}

.ai-search-hero-content {
  text-align: center;
  max-width: 800px;
}

.ai-search-hero-title {
  margin: 0 auto var(--size-16);

  .ai-search-hero-ai-text {
    background: linear-gradient(135deg, var(--primary-600), var(--secondary-500));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
  }
}

.ai-search-hero-subtitle {
  font-size: var(--text-lg);
  color: var(--monochrome-700);
  margin-bottom: var(--size-32);
  line-height: 1.6;
}

.ai-search-hero-search {
  margin-bottom: var(--size-32);
  display: flex;
  justify-content: center;
}

.ai-search-hero-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--monochrome-white);
  border: 2px solid var(--monochrome-900);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 600px;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;

  @include mq.mobile-only {
    min-width: 300px;
  }
}
.ai-search-hero-input-container::-webkit-scrollbar {
  display: none;
}

.ai-search-hero-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--size-16) var(--size-20);
  font-size: var(--text-lg);
  min-height: 60px;
  color: var(--monochrome-800);
  outline: none;

  @include mq.mobile-only {
    font-size: var(--text-base);
  }

  &::placeholder {
    color: var(--monochrome-500);
    opacity: 1; /* Ensure full opacity for animated placeholder */
  }

  &:focus::placeholder {
    opacity: 0.7; /* Slightly fade placeholder when focused */
  }
}

.ai-search-hero-text-measure {
  position: absolute;
  left: var(--size-20);
  top: 50%;
  transform: translateY(-50%);
  visibility: hidden;
  pointer-events: none;
  font-size: var(--text-lg);
  white-space: nowrap;

  @include mq.mobile-only {
    font-size: var(--text-base);
  }
}

.ai-search-hero-cursor {
  color: var(--primary-600);
  font-weight: 300;
  transition: opacity 0.1s ease;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;

  &.blinking {
    animation: blink 1s infinite;
  }
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.ai-search-hero-divider {
  margin: var(--size-32) auto;
  max-width: calc(100% - var(--size-32));
}

.ai-search-hero-footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--size-16);

  @include mq.tablet-only {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mq.mobile-only {
    grid-template-columns: 1fr;
  }
}

.ai-search-hero-footer-link {
  background-color: fn.faded-color(12%, var(--monochrome-600));
  transition: all 0.2s ease;

  /* Ensure all links have equal height in grid */
  display: flex;
  align-items: center;

  &:hover {
    background-color: fn.faded-color(24%, var(--monochrome-600));
    transform: translateY(-2px);
  }
}
</style>
