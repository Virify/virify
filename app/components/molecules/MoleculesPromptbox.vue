<template>
  <div class="m-promptbox m-promptbox--overlay">
    <!-- analysed query overlays the textarea -->
    <div class="m-promptbox__overlay" v-if="queryAnalysis" v-html="getAnalyzedQuery()"></div>
    <textarea
      :id
      class="m-promptbox__textarea"
      :placeholder
      :aria-label="props.label"
      v-model="textarea"
      :style="queryAnalysis ? 'color: transparent; caret-color: var(--color-300);' : ''"
    ></textarea>
    <button type="submit" class="m-promptbox__button" aria-label="Submit" @click.prevent="$emit('submit', textarea)">
      <AtomsIcon icon="ai/send" aria-hidden />
    </button>
  </div>
</template>

<script setup lang="ts">
const { getAnalyzedQuery, queryAnalysis } = useAi()

const props = defineProps({
  id: String,
  placeholder: String,
  label: { type: String, default: 'Enter your prompt here' }
})

defineEmits<{
  (e: 'submit', value: string): void
}>()

const textarea = defineModel({ default: '' })
</script>

<style lang="scss">
.m-promptbox {
  display: flex;
  align-items: flex-end;
  gap: 0;
  border: 1px solid var(--border-color-200);
  background: var(--background-200);
  border-radius: var(--border-radius-lg);
  padding: var(--size-10) var(--size-14);

  &:has(textarea:focus) {
    outline: var(--focus-outline);
  }

  &__textarea {
    position: relative;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    padding: 0;
    margin: 0;
    min-height: 8ch;
    resize: none;
    outline: none;
    z-index: 2;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 0;
    margin: 0;
    border-radius: var(--border-radius-lg);
    color: var(--monochrome-900);
    background: var(--monochrome-100);
    width: var(--size-48);
    height: var(--size-48);
    transition: background-color var(--animation-fast);

    &:hover {
      color: var(--monochrome-900);
      background: var(--secondary-400);
    }

    svg {
      display: block;
      width: var(--size-24);
      height: var(--size-24);
    }
  }

  &__analysis {
    margin-top: var(--size-6);
    color: var(--color-300);
    font-size: 0.95em;
    font-style: italic;
  }
}

.m-promptbox--overlay {
  position: relative;
}

.m-promptbox__overlay {
  position: absolute;
  top: var(--size-10);
  left: var(--size-14);
  right: var(--size-48);
  bottom: var(--size-10);
  pointer-events: none;
  color: inherit;
  font: inherit;
  white-space: pre-wrap;
  z-index: 1;
  overflow: hidden;
}
</style>