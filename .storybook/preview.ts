import type { Preview } from '@storybook/vue3-vite'
import { computed, defineComponent } from 'vue'
import { setup } from '@storybook/vue3'
import '../app/assets/css/main.css'
import '../layers/ui/assets/styles/main.scss'

// Import components that should be globally available
import AtomsIcon from '../layers/ui/components/atoms/AtomsIcon.vue'

// Mock Nuxt composables and utilities
globalThis.useHead = () => {};
globalThis.computed = computed;
globalThis.getSplitString = (str, separator) => str.split(separator);

// Setup global components
setup((app) => {
  app.component('AtomsIcon', AtomsIcon);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;