// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  middleware: ["cors"],
  ssr: false,
  css: ["~/assets/css/main.css"],
});
