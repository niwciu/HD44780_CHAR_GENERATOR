import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/HD44780_CHAR_GENERATOR/', 
  plugins: [react()],
})
