import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'
/// <reference types="vitest" />

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' http://localhost:3001 https://*.descope.com wss://localhost:*",
  "frame-src 'none'",
  "object-src 'none'",
].join('; ')

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env.EXPO_PUBLIC_API_URL': JSON.stringify(
      process.env.VITE_API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'
    ),
  },
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        tags: [
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
})
