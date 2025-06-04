// Nuxt configuration for the analytics layer
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ["nuxt-gtag"],
  gtag: {
    id: process.env.G_TAG,
  },
});
