// Splash-only build: no database, no auth, no API routes.
// The homepage is the only route — everything else redirects to it.
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  ssr: true,
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-07-09",
  app: {
    head: {
      htmlAttrs: { lang: "en-GB" },
      title: "Virify",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "description", content: "Virify is making updates. Check back soon." },
        { name: "robots", content: "noindex, nofollow" },
        { name: "theme-color", content: "#0c1317" },
        { name: "application-name", content: "Virify" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon-180x180.png" },
        { rel: "manifest", href: "/manifest.json" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;600&display=swap",
        },
      ],
    },
  },
  nitro: {
    routeRules: {
      // Nothing is crawlable or cached while the site is down.
      "/**": { headers: { "x-robots-tag": "noindex, nofollow" } },
    },
  },
  devtools: { enabled: false },
});
