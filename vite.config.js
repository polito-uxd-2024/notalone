import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/notalone/',
  plugins: [
    react(),
    VitePWA(
      { 
        registerType: 'autoUpdate',
        manifest: {
          name: 'notAlone',
          short_name: 'notAlone',
          description: 'Hey! I am Al.',
          theme_color: '#ffffff',
          icons: [
            {
              "src": "/pwa-192x192.png",
              "sizes": "192x192",
              "type": "image/png",
              "purpose": "any"
            },
            {
              "src": "/pwa-512x512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "any"
            },
            {
              "src": "/pwa-maskable-192x192.png",
              "sizes": "192x192",
              "type": "image/png",
              "purpose": "maskable"
            },
            {
              "src": "/pwa-maskable-512x512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "maskable"
            }
          ]
        }
    })
  ],
})
