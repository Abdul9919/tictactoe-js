import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
        host: '0.0.0.0', // Listen on all network interfaces
        // Or, use true to listen on all addresses, including LAN and public addresses
        // host: true,
        allowedHosts: [
      'beginning-folks-permits-funk.trycloudflare.com'
    ] 
      },
})