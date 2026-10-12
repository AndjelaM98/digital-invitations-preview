/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_MEMORIES_API_URL?: string;
  }
}

declare module "*.mp4" {
  const src: string;
  export default src;
}

declare module "*.webm" {
  const src: string;
  export default src;
}
