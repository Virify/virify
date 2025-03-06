import { defineFormKitConfig } from '@formkit/vue'
import { rootClasses } from './formkit.theme'
import { genesisIcons } from '@formkit/icons'
import { createMultiStepPlugin } from '@formkit/addons'

export default defineFormKitConfig({
  // rules: {},
  // locales: {},
  // etc. 
  config: {
    rootClasses,
  },
  plugins: [createMultiStepPlugin()],
  icons: {
    ...genesisIcons,
  },
})