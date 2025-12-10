export default defineNuxtConfig({
  modules: ["nuxt-auth-utils"],
  runtimeConfig: {
    public: {
      redirectCookieName: "redirect",
      loginUrl: "/login",
      NUXT_SESSION_PASSWORD: process.env.NUXT_SESSION_PASSWORD,
      DEPLOYMENT_ENV: process.env.DEPLOYMENT_ENV,
    },
  },
  imports: {
    dirs: ["server/utils", "server/plugins"],
  },
  // devServer: {
  //   https: {
  //     key: "./server.key",
  //     cert: "./server.crt",
  //   },
  // },
});

/**
 * !! IMPORTANT !!
 * Nuxt Auth Module Configuration
 *
 * Nuxt Auth Utils required secure cookies - Safari does not allow secure cookies to be set without a valid HTTPS connection.
 *
 * You will need to run the below commands in terminal to generate the SSL certificate:
 *
 * openssl genrsa 2048 > server.key
 * chmod 400 server.key
 * openssl req -new -x509 -nodes -sha256 -days 365 -key server.key -out server.crt
 */
