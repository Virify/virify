import * as maptilersdk from '@maptiler/sdk';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  // Initialize MapTiler with API key from environment
  if (config.public.MAPTILER_API_KEY) {
    maptilersdk.config.apiKey = config.public.MAPTILER_API_KEY;
  } else {
    console.warn('MapTiler API key not found in environment variables');
  }
  
  return {
    provide: {
      maptilersdk
    }
  };
});
