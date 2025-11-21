/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // 📝 Nếu sau này bạn có thêm biến môi trường, hãy khai báo ở đây, ví dụ:
  // readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
