import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages는 https://<user>.github.io/<repo>/ 경로로 서비스되므로
// base를 저장소 이름에 맞춘다. (사용자/조직 페이지면 '/'로 변경)
export default defineConfig({
  plugins: [react()],
  base: '/',
})
