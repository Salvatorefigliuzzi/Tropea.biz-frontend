import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'global-builtin', 'import', 'if-function'],
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split icons by set (e.g., react-icons/fa) to avoid one huge chunk
            if (id.includes('react-icons')) {
              const match = id.match(/react-icons\/([^/]+)/);
              return match ? `icons-${match[1]}` : 'icons-vendor';
            }
            
            // Group all React-related packages to avoid circular dependency warnings
            if (id.includes('react') || id.includes('redux') || id.includes('router') || id.includes('remix')) {
              return 'react-vendor';
            }
            
            // UI libraries
            if (id.includes('bootstrap') || id.includes('popper')) {
              return 'ui-vendor';
            }
            
            // Everything else
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
