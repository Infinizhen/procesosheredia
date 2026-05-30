import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { buildSitemap } from './src/lib/sitemap'

// Emit a generated sitemap.xml into the build output. Kept in sync with the
// routes/locales via buildSitemap() (unit-tested in src/lib/sitemap.test.ts).
function emitSitemap(): Plugin {
  return {
    name: 'emit-sitemap',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: buildSitemap(),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), emitSitemap()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
})
