import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' agar build bisa di-deploy ke GitHub Pages
export default defineConfig({ base: './', plugins: [react(), tailwindcss()] })
