import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => { 
  const env = loadEnv(mode, process.cwd(), ''); 
  return {
    plugins: [
      devtools(),
      tsconfigPaths({ projects: ['./tsconfig.json'] }),
      tailwindcss(),
      tanstackRouter(),
      viteReact(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        manifest: {
            "short_name": env.VITE_SITE_TITLE,
            "name": `${env.VITE_SITE_TITLE}'s Portfolio`,
            "icons": [
              {
                "src": `/${env.VITE_TARGET_USER}/favicon.ico`,
                "sizes": "64x64 32x32 24x24 16x16",
                "type": "image/x-icon"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/favicon-16x16.png`,
                "type": "image/png",
                "sizes": "16x16"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/favicon-32x32.png`,
                "type": "image/png",
                "sizes": "32x32"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/favicon-96x96.png`,
                "type": "image/png",
                "sizes": "96x96"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/favicon-128.png`,
                "type": "image/png",
                "sizes": "128x128"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/favicon-196x196.png`,
                "type": "image/png",
                "sizes": "196x196"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/apple-touch-icon-57x57.png`,
                "type": "image/png",
                "sizes": "57x57"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/apple-touch-icon-60x60.png`,
                "type": "image/png",
                "sizes": "60x60"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/apple-touch-icon-72x72.png`,
                "type": "image/png",
                "sizes": "72x72"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/apple-touch-icon-76x76.png`,
                "type": "image/png",
                "sizes": "76x76"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/apple-touch-icon-114x114.png`,
                "type": "image/png",
                "sizes": "114x114"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/apple-touch-icon-120x120.png`,
                "type": "image/png",
                "sizes": "120x120"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/apple-touch-icon-144x144.png`,
                "type": "image/png",
                "sizes": "144x144"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/apple-touch-icon-152x152.png`,
                "type": "image/png",
                "sizes": "152x152"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/apple-touch-icon.png`,
                "type": "image/png",
                "sizes": "180x180"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/android-chrome-192x192.png`,
                "type": "image/png",
                "sizes": "192x192"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/android-chrome-512x512.png`,
                "type": "image/png",
                "sizes": "512x512",
                "purpose": "any maskable"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/mstile-70x70.png`,
                "type": "image/png",
                "sizes": "70x70"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/mstile-144x144.png`,
                "type": "image/png",
                "sizes": "144x144"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/mstile-150x150.png`,
                "type": "image/png",
                "sizes": "150x150"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/mstile-310x150.png`,
                "type": "image/png",
                "sizes": "310x150"
              },
              {
                "src": `/${env.VITE_TARGET_USER}/mstile-310x310.png`,
                "type": "image/png",
                "sizes": "310x310"
              }
            ],
            "start_url": ".",
            "display": "standalone",
            "theme_color": env.VITE_THEME_LIGHT,
            "background_color": env.VITE_THEME_LIGHT
        }
      })
    ]
  }
})
