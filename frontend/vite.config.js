import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || './',
  define: {
    global: 'window',
    'process.env': {},
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});

