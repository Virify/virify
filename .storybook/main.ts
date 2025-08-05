import type { StorybookConfig } from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue'


const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": {
    "name": "@storybook/vue3-vite",
    "options": {}
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      plugins: [vue()],
      resolve: {
        alias: {
          '#styles': new URL('../layers/ui/assets/styles', import.meta.url).pathname,
          '~': new URL('..', import.meta.url).pathname,
          '#ui': new URL('../layers/ui', import.meta.url).pathname,
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            // Don't add global imports to avoid module loops
          },
        },
      },
    });
  },
  
};
export default config;