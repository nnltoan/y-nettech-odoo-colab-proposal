import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dual-target deployment:
// - Vercel / local dev: base = '/'  (default, no env var set)
// - GitHub Pages: base = '/y-nettech-odoo-colab-proposal/'
//   set DEPLOY_TARGET=github-pages in the GH Actions workflow before `npm run build`
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages'

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? '/y-nettech-odoo-colab-proposal/' : '/',
  server: {
    port: 5173,
    open: true
  }
})
