<template>
  <div class="m-promptbox | elevate-200">
    <div class="m-promptbox__input-wrapper">
      <!-- analysed query overlays the textarea -->
      <div class="m-promptbox__overlay" v-if="queryAnalysis" aria-hidden="true">
        <span v-for="(segment, index) in getAnalyzedQuery()" :key="index" :class="`segment--${segment.type} r-body-md-xs`">
          {{ segment.text }}
        </span>
      </div>

      <textarea :id class="m-promptbox__textarea | r-body-md-xs" :placeholder :aria-label="props.label" v-model="textarea"
        :style="queryAnalysis ? 'color: transparent; caret-color: var(--foreground-100);' : ''"></textarea>
    </div>

    <button type="submit" class="m-promptbox__button" aria-label="Submit" :disabled="disabled" @click.prevent="$emit('submit', textarea)">
      <AtomsIcon icon="ai/send" aria-hidden />
    </button>
  </div>
</template>

<script setup lang="ts">
const { getAnalyzedQuery, queryAnalysis } = useAi()

const props = defineProps({
  id: String,
  placeholder: String,
  label: { type: String, default: 'Enter your prompt here' },
  disabled: { type: Boolean, default: false }
})

defineEmits<{
  (e: 'submit', value: string): void
}>()

const textarea = defineModel({ default: '' })
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.m-promptbox {
  display: flex;
  align-items: flex-end;
  gap: var(--size-16);
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  padding: var(--size-16);
  border: 1px solid var(--border-color-200);

  @include mq.small-tablet {
    border-radius: var(--border-radius-2xl);
  }

  &:has(textarea:focus) {
    outline: var(--focus-outline);
  }
}

.m-promptbox__input-wrapper {
  position: relative;
  flex: 1;
  display: grid;
  grid-template-areas: "input";
}

.m-promptbox__overlay,
.m-promptbox__textarea {
  grid-area: input;
  white-space: pre-wrap;
  word-wrap: break-word;
  letter-spacing: inherit;
  line-height: inherit;
  padding: 0;

  @include mq.small-tablet {
    padding: var(--size-8);
  }

  @include mq.tablet {
    padding: var(--size-16);
  }
}

.m-promptbox__textarea {
  position: relative;
  border: none;
  background: transparent;
  color: inherit;
  margin: 0;
  min-height: 12ch;
  resize: none;
  outline: none;
  z-index: 2;
}

.m-promptbox__overlay {
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.m-promptbox__button {
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
  flex: 0 0 auto;

  &:hover:not(:disabled) {
    color: var(--monochrome-900);
    background: var(--secondary-400);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--monochrome-300);
  }

  svg {
    display: block;
    width: var(--size-24);
    height: var(--size-24);
  }
}

.m-promptbox__analysis {
  margin-top: var(--size-6);
  color: var(--color-300);
  font-size: 0.95em;
  font-style: italic;
}

.segment--used {
  color: #ea580c;
}

.segment--ignored {
  text-decoration: line-through;
  color: #6b7280;
  opacity: 0.7;
}

.segment--normal {
  color: var(--foreground-100);
}
</style>