<template>
  <div class="m-animated-search-input__container">
    <div class="m-animated-search-input__fieldset | elevate-200">
      <input 
        type="text" 
        class="m-animated-search-input__input | body-md" 
        :value="displayText"
        placeholder="Where do you want to live?"
        aria-label="Location"
        readonly
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const searches = [
  '2 bed house with large garden',
  '4 bed cottage with EV charging',
  'Flat with balcony',
  '3 bed semi with home office',
  'Modern apartment with parking',
  'Flat with gym access',
  '3 bed house with open plan kitchen',
]

const displayText = ref('')
const currentSearchIndex = ref(0)
const isTyping = ref(true)

const typeSpeed = 80 // milliseconds per character
const deleteSpeed = 50 // milliseconds per character
const pauseBeforeDelete = 2000 // pause after typing complete
const pauseBeforeType = 500 // pause before starting to type

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function animateSearches() {
  while (true) {
    const currentSearch = searches[currentSearchIndex.value]
    
    if (!currentSearch) continue
    
    // Type out the text
    isTyping.value = true
    for (let i = 0; i <= currentSearch.length; i++) {
      displayText.value = currentSearch.substring(0, i)
      await sleep(typeSpeed)
    }
    
    // Pause with full text
    await sleep(pauseBeforeDelete)
    
    // Delete the text
    isTyping.value = false
    for (let i = currentSearch.length; i >= 0; i--) {
      displayText.value = currentSearch.substring(0, i)
      await sleep(deleteSpeed)
    }
    
    // Move to next search
    currentSearchIndex.value = (currentSearchIndex.value + 1) % searches.length
    
    // Pause before typing next
    await sleep(pauseBeforeType)
  }
}

onMounted(() => {
  animateSearches()
})
</script>

<style lang="scss">
@use "#styles/_utils/functions" as fn;
@use "#styles/_utils/media" as mq;

.m-animated-search-input {
  &__container {
    max-width: 100%;
  }

  &__fieldset {
    background: var(--background-200);
    color: var(--foreground-100);
    border-radius: var(--border-radius-xl);
    align-items: center;
    border: 1px solid var(--border-color-200);
    padding: var(--size-16);
    
    @include mq.tablet {
      border-radius: var(--border-radius-2xl);
    }
  }

  &__input {
    background-color: transparent;
    color: currentColor;
    border-radius: var(--border-radius-lg);
    padding: 0;
    width: 100%;
    border: none;
    outline: none;
    cursor: default;

    @include mq.tablet {
      border-radius: var(--border-radius-xl);
    }
    
    &::placeholder {
      color: var(--foreground-300);
    }
  }
}
</style>
