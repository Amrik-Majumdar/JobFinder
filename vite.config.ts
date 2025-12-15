import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        try {
          const srcPath = join(__dirname, 'public', '404.html')
          const destPath = join(__dirname, 'dist', '404.html')
          if (existsSync(srcPath)) {
            copyFileSync(srcPath, destPath)
          }
        } catch (e) {
          // File might not exist, that's okay - Vite will copy public folder anyway
        }
      },
    },
  ],
  base: '/Joby/',
  build: {
    outDir: 'dist',
  },
  publicDir: 'public',
})

