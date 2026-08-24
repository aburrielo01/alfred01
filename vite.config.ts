import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  // La tipografía viaja dentro del CSS: un artefacto autónomo, sin peticiones.
  build: { assetsInlineLimit: 40960 },
  server: { host: true, port: 5173 },
})
