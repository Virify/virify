<template>
  <div class="ai-search-hero">
    <div class="ai-search-hero__content">
      <h1 class="ai-search-hero__title | title-2xl lineheight-xs">
        Find Your Perfect Home with <GradientText>Virify AI</GradientText>
      </h1>

      <p class="ai-search-hero__subtitle | body-md">Describe your dream home in your own words. Our AI does the rest—matching you
        with the best properties, fast.</p>

      <!-- Functional Search Input -->
      <form @submit.prevent="handleSearch" class="ai-search-hero__search">
        <div class="ai-search-hero__input-container">
          <input v-model="searchQuery" type="text" class="ai-search-hero__input" :placeholder="currentText"
            @focus="handleInputFocus" @blur="handleInputBlur" />
          <button type="submit" class="ai-search-hero__submit | button-lg" @click="selectSuggestion(searchQuery)">
            <AtomsIcon icon="search" title="search" />
          </button>
        </div>
      </form>

      <AtomsDivider text="try these searches" class="ai-search-hero__divider" />

      <div role="presentation" class="ai-search-hero__suggestions">
        <MoleculesIconLink class="ai-search-hero__suggestion" icon="property/house" content="3 bedroom house"
          icon-inline @click="selectSuggestion('3 bedroom house')" />
        <MoleculesIconLink class="ai-search-hero__suggestion" icon="property/flat"
          content="House in Cardiff city centre" icon-inline
          @click="selectSuggestion('house in Cardiff city centre')" />
        <MoleculesIconLink class="ai-search-hero__suggestion" icon="property/house" content="House with modern kitchen"
          icon-inline @click="selectSuggestion('house with modern kitchen and breakfast bar')" />
        <MoleculesIconLink class="ai-search-hero__suggestion" icon="property/flat"
          content="Flat with balcony and parking" icon-inline
          @click="selectSuggestion('flat with balcony and parking')" />
        <MoleculesIconLink class="ai-search-hero__suggestion" icon="property/house"
          content="Property with garden and garage" icon-inline
          @click="selectSuggestion('property with garden and garage')" />
        <MoleculesIconLink class="ai-search-hero__suggestion" icon="property/house"
          content="Pet friendly house with garden" icon-inline
          @click="selectSuggestion('pet friendly house with garden')" />
      </div>

      <AtomsDivider text="or" class="ai-search-hero__divider" />

      <div role="presentation" class="ai-search-hero__actions">
        <MoleculesIconLink class="ai-search-hero__action" to="/search/legacy" icon="explore/ai"
          content="Traditional search" icon-inline />
        <MoleculesIconLink class="ai-search-hero__action" to="/map-search/" icon="explore/map" content="Search by map"
          icon-inline />
      </div>
    </div>
  </div>
</template>

<script setup>
import GradientText from '~/components/atoms/GradientText.vue';

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
const isFocused = ref(false);

// Animation timing
const TYPING_SPEED = 100; // ms per character
const DELETING_SPEED = 50; // ms per character
const PAUSE_BETWEEN_SUGGESTIONS = 2000; // ms

const typeText = async (text) => {
  // Type the text
  for (let i = 0; i <= text.length; i++) {
    currentText.value = text.substring(0, i);
    await new Promise((resolve) => setTimeout(resolve, TYPING_SPEED));
  }

  // Pause at the end
  await new Promise((resolve) => setTimeout(resolve, PAUSE_BETWEEN_SUGGESTIONS));

  // Delete the text
  for (let i = text.length; i >= 0; i--) {
    currentText.value = text.substring(0, i);
    await new Promise((resolve) => setTimeout(resolve, DELETING_SPEED));
  }

  // Brief pause before next suggestion
  await new Promise((resolve) => setTimeout(resolve, 500));
};

const startTypingAnimation = async () => {
  while (isTyping.value) {
    const currentSuggestion = suggestions[currentSuggestionIndex.value];
    await typeText(currentSuggestion);
    currentSuggestionIndex.value = (currentSuggestionIndex.value + 1) % suggestions.length;
  }
};

const selectSuggestion = (suggestion) => {
  emit("selectSuggestion", suggestion);
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit("selectSuggestion", searchQuery.value.trim());
  }
};

const handleInputFocus = () => {
  isFocused.value = true;
};

const handleInputBlur = () => {
  isFocused.value = false;
};

onMounted(() => {
  startTypingAnimation();
});

onUnmounted(() => {
  isTyping.value = false;
});
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;

.ai-search-hero {
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  color: var(--monochrome-900);
  border-radius: var(--border-radius-3xl);
  min-height: max(500px, 60vh);
  margin-bottom: var(--size-32);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-56) var(--size-20);

  @include mq.tablet {
    padding: var(--size-72);
    position: relative;
  }

  &__content {
    text-align: center;
    width: 100%;
  }

  &__title {
    margin: 0 auto var(--size-16);
  }

  &__subtitle {
    color: var(--monochrome-700);
    margin-bottom: var(--size-32);
  }

  &__search {
    margin-bottom: var(--size-32);
    display: flex;
    justify-content: center;
  }

  &__input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--monochrome-white);
    border: 2px solid var(--monochrome-900);
    border-radius: var(--border-radius-lg);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    min-width: 800px;

    @include mq.tablet-only {
      min-width: 600px;
      max-width: calc(100vw - var(--size-64));
    }

    @include mq.mobile-only {
      min-width: 100%;
      max-width: calc(100vw - var(--size-40));
    }
  }

  &__input {
    flex: 1;
    background: transparent;
    border: none;
    padding: var(--size-16) var(--size-20);
    min-height: 60px;
    color: var(--monochrome-800);
    outline: none;

    &::placeholder {
      color: var(--monochrome-500);
      opacity: 1;
    }

    &:focus::placeholder {
      opacity: 0.7;
    }
  }

  &__submit {
    background: none;
    border: none;
    color: var(--monochrome-900);
    cursor: pointer;
    display: flex;
  }

  &__divider {
    margin: var(--size-32) auto;
    max-width: 600px;
  }

  &__suggestions {
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

  &__suggestion {
    background-color: fn.faded-color(12%, var(--monochrome-600));
    transition: all 0.2s ease;
    display: flex;
    align-items: center;

    &:hover {
      background-color: fn.faded-color(24%, var(--monochrome-600));
      transform: translateY(-2px);
    }
  }

  &__actions {
    display: flex;
    align-items: stretch;
    gap: var(--size-16);
    max-width: 600px;
    margin: 0 auto;

    @include mq.mobile-only {
      flex-direction: column;
    }
  }

  &__action {
    flex-grow: 1;
    background-color: fn.faded-color(12%, var(--monochrome-600));
    transition: all 0.2s ease;

    &:hover {
      background-color: fn.faded-color(24%, var(--monochrome-600));
      transform: translateY(-2px);
    }
  }
}
</style>