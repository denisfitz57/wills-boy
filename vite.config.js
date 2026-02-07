import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Use relative paths for GitHub Pages sub-directory hosting
  plugins: [react()],
})
