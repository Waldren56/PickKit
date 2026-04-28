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
        theme_color: '#d97706', /* amber-600 */
        background_color: '#fffef5', /* banana white */
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
