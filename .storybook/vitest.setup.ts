import { setProjectAnnotations } from '@storybook/vue3-vite';
import { computed } from 'vue';
import * as projectAnnotations from './preview';

// Mock global functions that components might use
globalThis.useHead = () => {};
globalThis.computed = computed;
globalThis.getSplitString = (str: string, separator: string) => str.split(separator);

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([projectAnnotations]);