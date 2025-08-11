// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VUE_APP_API_KEY: string;
  readonly VUE_APP_AUTH_DOMAIN: string;
  readonly VUE_APP_DATABASE_URL: string;
  readonly VUE_APP_PROJECT_ID: string;
  readonly VUE_APP_STORAGE_BUCKET: string;
  readonly VUE_APP_MESSAGING_SENDER_ID: string;
  readonly VUE_APP_ID: string;
  readonly VUE_APP_MEASUREMENT_ID: string;
  // adicione mais se precisar
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}