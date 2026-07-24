/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the separately hosted Payload CMS, e.g. https://cms.example.com */
  readonly VITE_CMS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
