import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Pickit Shopping',
        short_name: 'Pickit',
        description: 'La tua Smart Shopping List',
        theme_color: '#0f172a', /* the dark mode background */
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            // Placeholder per l'app icon 
            src: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
