import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages 프로젝트 사이트는 https://<user>.github.io/<repo>/ 경로에서 서빙되므로,
// 정적 자산 경로가 그 하위 경로를 기준으로 잡히도록 base를 지정해야 한다.
// 로컬 개발/빌드에는 영향이 없도록 CI에서만 GITHUB_PAGES=true를 설정한다.
const isGithubPagesBuild = process.env.GITHUB_PAGES === 'true';

// https://vite.dev/config/
export default defineConfig({
  base: isGithubPagesBuild ? '/Condolence_Money_Settlement_Program/' : '/',
  plugins: [react(), tailwindcss()],
})
